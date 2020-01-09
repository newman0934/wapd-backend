const db = require('../models')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const superagent = require('superagent')
const { Order, OrderItem, CartItem, Coupon, Product, Image, User } = db
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ACCOUNT,
    pass: process.env.EMAIL_PASSWORD
  }
})

const URL = process.env.URL
const MerchantID = process.env.MERCHANT_ID // 藍新商店代號
const HashKey = process.env.HASH_KEY // 藍新金鑰
const HashIV = process.env.HASH_IV // 藍新金鑰
const TransitionGateWay = 'https://ccore.spgateway.com/API/QueryTradeInfo' // 藍新交易查詢網頁
const PayGateWay = 'https://ccore.spgateway.com/MPG/mpg_gateway' // 藍新支付網頁
const ReturnURL = URL + '/api/spgateway/callback?from=ReturnURL'
const NotifyURL = URL + '/api/spgateway/NotifyURL'
const ClientBackURL = 'http://localhost:8080/#/users/orders' // ATM、WEBATM、條碼繳費完成後的CB URL

/* ----- 藍新用 function start ----- */
// 把 Object 的資料轉成字串型的資料
function genDataChain(TradeInfo) {
  let results = []
  for (let kv of Object.entries(TradeInfo)) {
    results.push(`${kv[0]}=${kv[1]}`)
  }
  return results.join('&')
}

// 把字串型的資料加密
function create_mpg_aes_encrypt(TradeInfo) {
  let encrypt = crypto.createCipheriv('aes256', HashKey, HashIV)
  let enc = encrypt.update(genDataChain(TradeInfo), 'utf8', 'hex')
  return enc + encrypt.final('hex')
}

function create_mpg_aes_decrypt(TradeInfo) {
  let decrypt = crypto.createDecipheriv('aes256', HashKey, HashIV)
  decrypt.setAutoPadding(false)
  let text = decrypt.update(TradeInfo, 'hex', 'utf8')
  let plainText = text + decrypt.final('utf8')
  let result = plainText.replace(/[\x00-\x20]+/g, '')
  return result
}

// 對加密後的資料做雜湊
function create_mpg_sha_encrypt(TradeInfo) {
  let sha = crypto.createHash('sha256')
  let plainText = `HashKey=${HashKey}&${TradeInfo}&HashIV=${HashIV}`

  return sha
    .update(plainText)
    .digest('hex')
    .toUpperCase()
}

// 取得加密的結果 Amt: 訂單價格, Desc: 敘述, email: 使用者的email
function getTradeInfo(Amt, Desc, email, CREDIT, VACC, CVS, CVSCOM) {
  console.log('===== getTradeInfo =====')
  console.log(Amt, Desc, email, CVSCOM)
  console.log('==========')

  data = {
    // 這是要給藍新的資料
    MerchantID: MerchantID, // 商店代號
    RespondType: 'JSON', // 回傳格式
    TimeStamp: Date.now(), // 時間戳記
    Version: 1.5, // 串接程式版本
    MerchantOrderNo: Date.now(), // 商店訂單編號
    LoginType: 0, // 智付通會員
    OrderComment: 'OrderComment', // 商店備註
    Amt: Amt, // 訂單金額
    ItemDesc: Desc, // 產品名稱
    Email: email, // 付款人電子信箱
    ReturnURL: ReturnURL, // 支付完成返回商店網址
    NotifyURL: NotifyURL, // 支付通知網址/每期授權結果通知
    ClientBackURL: ClientBackURL, // 支付取消返回商店網址
    CREDIT: CREDIT, // 是否啟用信用卡
    VACC: VACC, // 是否啟用ATM
    CVS: CVS,
    CVSCOM: CVSCOM // 超商
  }

  console.log('===== getTradeInfo: data =====')
  console.log(data)

  mpg_aes_encrypt = create_mpg_aes_encrypt(data)
  mpg_sha_encrypt = create_mpg_sha_encrypt(mpg_aes_encrypt)

  console.log('===== getTradeInfo: mpg_aes_encrypt, mpg_sha_encrypt =====')
  console.log(mpg_aes_encrypt)
  console.log(mpg_sha_encrypt)

  tradeInfo = {
    MerchantID: MerchantID, // 商店代號
    TradeInfo: mpg_aes_encrypt, // 加密後參數
    TradeSha: mpg_sha_encrypt, // 雜湊後參數
    Version: 1.5, // 串接程式版本
    PayGateWay: PayGateWay, // 發送 API 的位址
    MerchantOrderNo: data.MerchantOrderNo // 商品代碼(存到DB用的)
  }

  console.log('===== getTradeInfo: tradeInfo =====')
  console.log(tradeInfo)

  return tradeInfo
}

// 回傳交易狀態查詢需要的資訊
// TODO: 實作藍新交易狀態查詢API
/*
MerchantID: MerchantID
Version: 1.1
RespondType: JSON
CheckValue: getTransitionCheckValue(Amt, MerchantOrderNo)
TimeStamp: Date.now()
MerchantOrderNo: MerchantOrderNo
Amt: Amt
*/

function getTransitionCheckValue(Amt, MerchantOrderNo) {
  // step1: 取得加密前的字串
  let str = `IV=${HashIV}&Amt=${Amt}&MerchantID=${MerchantID}&MerchantOrderNo=${MerchantOrderNo}&Key=${HashKey}`
  console.log(`----雜湊前字串----`)
  console.log(str)
  // step2: 進行雜湊演算
  let sha = crypto.createHash('sha256')
  const CheckValue = sha
    .update(str)
    .digest('hex')
    .toUpperCase()
  console.log(`----雜湊後字串----`)
  console.log(CheckValue)
  return CheckValue
}

/* ----- 藍新用 function end ----- */

const orderService = {
  getOrders: async (req, res, callback) => {
    const orders = await Order.findAll({ include: 'items' })
    return callback({
      orders
    })
  },
  postOrder: async (req, res, callback) => {
    // step0: 驗證 Coupon 是否有效
    let couponResult = null
    if (req.body.couponCode) {
      couponResult = await Coupon.findOne({
        where: {
          coupon_code: req.body.couponCode
        }
      })
      if (!couponResult) {
        return callback({
          status: 'error',
          message: 'coupon is not existed!!'
        })
      }
    }
    // step1: 建立訂單
    // 1-1: 先取出包含 userId 的 cartitem
    const cartitems = await CartItem.findAll({
      where: {
        UserId: req.user.id
      },
      include: Product
    })
    console.log(cartitems[0].Product)
    if (!cartitems) {
      return callback({
        status: 'error',
        message: 'no matched cart items found'
      })
    }
    // 1-2: 建立 Order
    const order = await Order.create({
      UserId: req.user.id,
      CouponId: couponResult ? couponResult.id : null
    })
    // step2: 將購物車中的商品移至訂單
    for (let i = 0; i < cartitems.length; i++) {
      console.log(order.id, cartitems[i].id)
      await OrderItem.create({
        product_name: cartitems[i].Product.name,
        OrderId: order.id,
        ProductId: cartitems[i].ProductId,
        color: cartitems[i].color,
        size: cartitems[i].size,
        quantity: cartitems[i].quantity,
        sell_price: cartitems[i].Product.sell_price
      })
    }
    // step3: 訂單成立，刪除購物車
    await CartItem.destroy({ where: { UserId: req.user.id } })
    // step4: 完成後 callback 結果
    return callback({
      status: 'success',
      message: 'Order successfully created',
      OrderId: order.id
    })
  },
  postCoupon: async (req, res, callback) => {
    let couponResult = null
    if (!req.body.couponCode) {
      return callback({
        status: 'success',
        message: 'not using coupon'
      })
    }

    if (req.body.couponCode) {
      couponResult = await Coupon.findOne({
        where: {
          coupon_code: req.body.couponCode
        }
      })
      if (!couponResult) {
        return callback({
          status: 'error',
          message: 'coupon is not existed!!'
        })
      }
    }
    return callback({
      status: 'success',
      message: 'coupon is valid!!',
      CouponId: couponResult
    })
  },
  getCheckout: async (req, res, callback) => {
    const orderResult = await Order.findByPk(req.params.id, {
      include: { model: Product, as: 'items', include: Image }
    })
    if (!orderResult) {
      return callback({
        status: 'error',
        message: 'order does not exist!!'
      })
    }
    // 結帳過的訂單無法再進入此頁面
    // if (orderResult.payment_status) {
    //   return callback({
    //     status: 'error',
    //     message: 'this order has already been paid!!'
    //   })
    // }

    if (orderResult.UserId !== req.user.id) {
      return callback({
        status: 'error',
        message: 'order does not belong to current user!!'
      })
    }

    const orderItems = orderResult.items.map(d => ({
      orderItem: d.OrderItem,
      images: d.Images,
      productName: d.name, // 商品名稱
      subtotal: d.OrderItem.sell_price * d.OrderItem.quantity // 商品小計
    }))

    const orderSubTotal =
      orderItems.length === 1
        ? orderItems[0].subtotal
        : orderItems.reduce((a, b) => a.subtotal + b.subtotal)

    // 如果有折價券就抓出折價券
    let couponDiscount = 0
    if (orderResult.CouponId) {
      const coupon = await Coupon.findByPk(orderResult.CouponId)
      couponDiscount = coupon.discount_amount
    }

    // TODO: 串接物流後設定運費
    const shippingTotal = 0

    const total = orderSubTotal - couponDiscount + shippingTotal
    return callback({
      orderItems, // 商品
      orderSubTotal, // 所有商品小計
      couponDiscount, // 折扣
      shippingTotal, // 運費
      total // 總額
    })
  },

  postCheckout: async (req, res, callback) => {
    const order = await Order.findByPk(+req.body.orderId, {
      include: { model: Product, as: 'items' }
    })
    // 如果 order 不屬於該使用者會回傳 error
    if (order.UserId !== req.user.id) {
      return callback({
        status: 'error',
        message: 'current user does not match with order!!',
        orderId: req.body.orderId
      })
    }
    // console.log(order.items[0].OrderItem)
    // 後端演算 total 並檢查是否與前端發送的總額相符
    let orderTotal = 0
    order.items.map(d => {
      orderTotal += d.OrderItem.quantity * d.OrderItem.sell_price
    })
    // 如果 req.body.deliver 為 0 (使用者選擇宅配)，檢查 orderItem 價格總和是否等於 order 現階段 total_price +100；否則檢查是否相符
    if (+req.body.deliver === 0) {
      if (orderTotal + 100 !== +req.body.total) {
        return callback({
          status: 'error',
          message: "request body's total does not match database's total!!"
        })
      }
    } else {
      if (orderTotal !== +req.body.total) {
        return callback({
          status: 'error',
          message: "request body's total does not match database's total!!"
        })
      }
    }

    // if (+req.body.deliver === 0) {
    //   if (orderTotal !== +req.body.total) {
    //   }
    // }

    // 如果收件人欄位沒填妥會回傳 error
    if (
      !req.body.receiverName ||
      !req.body.receiverPhone ||
      !req.body.receiverAddress ||
      !req.body.total ||
      !req.body.orderId
    ) {
      return callback({
        status: 'error',
        message: 'every column must be input',
        orderId: req.body.orderId
      })
    }
    await order.update({
      receiver_name: req.body.receiverName,
      phone: req.body.receiverPhone,
      address: req.body.receiverAddress,
      total_price: req.body.total,
      shipping_method: req.body.deliver
    })
    // 成功後會回傳 orderId
    return callback({
      status: 'success',
      message: 'postCheckout successful',
      orderId: req.body.orderId
    })
  },

  getPayment: async (req, res, callback) => {
    const order = await Order.findByPk(req.params.id)
    const total = order.total_price
    const orderId = req.params.id
    const email = req.user.email
    let [CREDIT, VACC, CVS, CVSCOM] = [1, 1, 1, 0]
    // TODO: 依據使用者所選傳入對應結果：
    // 使用者選擇宅配0-> CREDIT=1 VACC=1 CVS=1 CVSCOM=0 (套用預設值)
    // 使用者選擇超商取貨1-> CREDIT=1 VACC=1 CVS=1 CVSCOM=1
    if (+order.shipping_method === 1) {
      CVSCOM = 1
    }
    // 使用者選擇超商取貨付款2-> CREDIT=0 VACC=0 CVS=0 CVSCOM=2
    if (+order.shipping_method === 2) {
      ;[CREDIT, VACC, CVS, CVSCOM] = [0, 0, 0, 2]
    }

    const tradeInfo = getTradeInfo(
      total,
      orderId,
      email,
      CREDIT,
      VACC,
      CVS,
      CVSCOM
    )
    await order.update({
      sn: tradeInfo.MerchantOrderNo
    })
    return callback({
      tradeInfo,
      total,
      orderId,
      email
    })
  },

  spgatewayCallback: async (req, res) => {
    // 藍新流程完成，回傳支付結果
    console.log('===== spgatewayCallback =====')
    console.log(req.method)
    console.log(req.query)
    console.log(req.body)
    console.log('==========')

    console.log('===== spgatewayCallback: TradeInfo =====')
    console.log(req.body.TradeInfo)
    // 把 TradeInfo 解密並轉為 json 格式
    const data = JSON.parse(create_mpg_aes_decrypt(req.body.TradeInfo))

    console.log('===== spgatewayCallback: create_mpg_aes_decrypt、data =====')
    console.log(data)

    const order = await Order.findOne({
      where: { sn: data['Result']['MerchantOrderNo'] },
      include: {
        model: Product,
        as: 'items'
      }
    })

    await order.update({
      payment_status: 1,
      payment_method: data.Result.PaymentType
    })

    const resData = {
      Status: data.Status,
      orderId: order.id
    }

    return res.redirect(
      `http://localhost:8080/#/users/paymentcomplete?Status=${resData.Status}&orderId=${resData.orderId}`
    )
  },

  notifyURLCallback: async (req, res, callback) => {
    const data = JSON.parse(create_mpg_aes_decrypt(req.body.TradeInfo))

    console.log('===== spgatewayCallback: create_mpg_aes_decrypt、data =====')
    console.log(data)

    if (data.Message === '超商取貨訂單模擬付款成功') {
      const order = await Order.findOne({
        where: {
          sn: data.Result.MerchantOrderNo,
          total_price: data.Result.Amt
        }
      })

      await order.update({
        payment_method: data.Result.PaymentType,
        payment_status: 1
      })
      return callback({
        status: 'success',
        message: '超商取貨訂單模擬付款成功'
      })
    }
  },

  getPaymentComplete: async (req, res, callback) => {
    if (!Object.keys(req.query).length) {
      return callback({
        status: 'error',
        message: 'route is invalid!!'
      })
    }
    const { Status, orderId } = req.query
    const orderResult = await Order.findByPk(orderId, {
      include: { model: Product, as: 'items', include: Image }
    })
    if (Status !== 'SUCCESS' || orderResult.payment_status !== '1') {
      return callback({
        status: 'error',
        message: 'payment failed!!'
      })
    }

    const userResult = await User.findByPk(req.user.id)
    const buyer = {
      name: userResult.name,
      phone: userResult.phone,
      email: userResult.email,
      address: userResult.address
    }
    const receiver = {
      name: orderResult.receiver_name,
      phone: orderResult.phone,
      // email: orderResult.email 目前資料表無此欄位
      address: orderResult.address
    }
    const orderItems = orderResult.items.map(d => ({
      name: `${d.name}-${d.OrderItem.color}-${d.OrderItem.size}`,
      quantity: d.OrderItem.quantity,
      images: d.Images
    }))

    // 寄信給收件者
    const mailOptions = {
      from: `wapd official <${process.env.EMAIL_ACCOUNT}>`,
      to: buyer.email, // 收件人
      subject: `【wapd】訂單 ${orderResult.id} 建立成功`,
      text: `親愛的 ${buyer.name} 您好：
      您購買的商品已收到款項，如有任何問題請聯繫我們，謝謝您
      `
    }
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error)
      } else {
        console.log('Email sent: ' + info.response)
      }
    })

    return callback({
      orderItems,
      buyer,
      receiver,
      total: orderResult.total_price
    })
  },

  postTransition: async (req, res, callback) => {
    const { amt, sn } = req.body
    const checkValue = getTransitionCheckValue(amt, sn)
    // TODO: 發送請求至藍新交易 API 網址並取得回傳結果
    superagent
      .post('https://ccore.spgateway.com/API/QueryTradeInfo')
      .type('form')
      .send({
        MerchantID: MerchantID,
        Version: '1.1',
        RespondType: 'JSON',
        CheckValue: checkValue,
        TimeStamp: Date.now(),
        MerchantOrderNo: sn,
        Amt: amt
      })
      .end(async (err, res) => {
        const response = JSON.parse(res.text)
        if (response.Status !== 'SUCCESS')
          return callback({
            status: 'error',
            message: '查詢失敗!!'
          })
        const order = await Order.findOne({
          where: {
            sn: sn
          }
        })
        console.log(response)
        await order.update({
          payment_method: response.Result.PaymentMethod,
          payment_status: response.Result.TradeStatus
        })
        return callback({
          status: 'OK',
          message: '資料庫更新成功!!',
          response
        })
      })
  }
}

module.exports = orderService
