const db = require('../models')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const Order = db.Order
const OrderItem = db.OrderItem
const Cart = db.Cart
const CartItem = db.CartItem
const Coupon = db.Coupon
const Product = db.Product

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
const PayGateWay = 'https://ccore.spgateway.com/MPG/mpg_gateway' // 藍新支付網頁
const ReturnURL = URL + '/spgateway/callback?from=ReturnURL'
const NotifyURL = URL + '/spgateway/callback?from=NotifyURL'
const ClientBackURL = URL + '/orders'

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
function getTradeInfo(Amt, Desc, email) {
  console.log('===== getTradeInfo =====')
  console.log(Amt, Desc, email)
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
    ClientBackURL: ClientBackURL // 支付取消返回商店網址
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
    console.log(`***** req.body: `)
    console.log(req.body)
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
    if (!cartitems) {
      return callback({
        status: 'error',
        message: 'no matched cart items found'
      })
    }

    console.log(`***** cartitems: `)
    console.log(cartitems)

    console.log(`***** Coupon:`)
    console.log(couponResult)

    // 1-2: 建立 Order
    const order = await Order.create({
      UserId: req.user.id,
      CouponId: couponResult ? couponResult.id : null
    })

    // step2: 將購物車中的商品移至訂單
    for (let i = 0; i < cartitems.length; i++) {
      console.log(order.id, cartitems[i].id)
      await OrderItem.create({
        OrderId: order.id,
        ProductId: cartitems[i].ProductId,
        color: cartitems[i].color,
        size: cartitems[i].size,
        quantity: cartitems[i].quantity,
        sell_price: cartitems[i].Product.sell_price
      })
    }

    // step3: 訂單成立後寄信給購買者(OK)
    const mailOptions = {
      from: `wapd official <${process.env.EMAIL_ACCOUNT}>`,
      to: 'caesarwang0937@gmail.com', // 收件人
      subject: `${order.id} 訂單成立`,
      text: `${order.id} 訂單成立`
    }
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error)
      } else {
        console.log('Email sent: ' + info.response)
      }
    })
    // step4: 訂單成立，刪除購物車
    await CartItem.destroy({ where: { UserId: req.user.id } })

    // step5: 完成後 callback 結果
    return callback({
      status: 'success',
      message: 'Order successfully created'
    })
  },
  postCoupon: async (req, res, callback) => {
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
    return callback({
      status: 'success',
      message: 'coupon is valid!!'
    })
  },
  getCheckout: async (req, res) => {
    console.log('===== getCheckout =====')
    console.log(req.params.id)
    console.log('==========')

    // return Order.findByPk(req.params.id, {}).then(order => {
    //   const tradeInfo = getTradeInfo(
    //     order.amount,
    //     '產品名稱',
    //     'caesarwang0937@gmail.com'
    //   )
    //   order
    //     .update({
    //       ...req.body,
    //       sn: tradeInfo.MerchantOrderNo
    //     })
    //     .then(order => {
    //       res.render('payment', { order, tradeInfo })
    //     })
    // })
  },
  spgatewayCallback: (req, res) => {
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

    return Order.findAll({
      // 把訂單中的付款狀態轉為 1
      where: { sn: data['Result']['MerchantOrderNo'] }
    }).then(orders => {
      orders[0]
        .update({
          ...req.body,
          payment_status: 1
        })
        .then(order => {
          // 支付完畢，導向 /orders 頁面
          return res.redirect('/orders')
        })
    })
  }
}

module.exports = orderService
