const crypto = require('crypto')
const URL = process.env.URL
const MerchantID = process.env.MERCHANT_ID // 藍新商店代號
const HashKey = process.env.HASH_KEY // 藍新金鑰
const HashIV = process.env.HASH_IV // 藍新金鑰
const TransitionGateWay = 'https://ccore.spgateway.com/API/QueryTradeInfo' // 藍新交易查詢網頁
const PayGateWay = 'https://ccore.spgateway.com/MPG/mpg_gateway' // 藍新支付網頁
const ReturnURL = URL + '/api/spgateway/ReturnURL'
const NotifyURL = URL + '/api/spgateway/NotifyURL'
const ClientBackURL = process.env.PORT
  ? 'https://newman0934.github.io/wapd-frontend/#/users/orders'
  : 'http://localhost:8080/#/users/orders' // ATM、WEBATM、條碼繳費完成後的CB URL

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

// 對加密後的資料做雜湊
function create_mpg_sha_encrypt(TradeInfo) {
  let sha = crypto.createHash('sha256')
  let plainText = `HashKey=${HashKey}&${TradeInfo}&HashIV=${HashIV}`

  return sha
    .update(plainText)
    .digest('hex')
    .toUpperCase()
}

const cryptoHelpers = {
  /* ---- 藍新用 function start ---- */
  create_mpg_aes_decrypt: function(TradeInfo) {
    let decrypt = crypto.createDecipheriv('aes256', HashKey, HashIV)
    decrypt.setAutoPadding(false)
    let text = decrypt.update(TradeInfo, 'hex', 'utf8')
    let plainText = text + decrypt.final('utf8')
    let result = plainText.replace(/[\x00-\x20]+/g, '')
    return result
  },

  // 取得加密的結果 Amt: 訂單價格, Desc: 敘述, email: 使用者的email
  getTradeInfo: function(Amt, Desc, email, CREDIT, VACC, CVS, CVSCOM) {
    console.log('===== getTradeInfo =====')
    console.log(Amt, Desc, email, CVSCOM)
    console.log('==========')

    const generatedMerchantOrderNo = Number(
      Date.now()
        .toString()
        .slice(-6) + Math.floor(Math.random() * 100 * Desc)
    )

    data = {
      // 這是要給藍新的資料
      MerchantID: MerchantID, // 商店代號
      RespondType: 'JSON', // 回傳格式
      TimeStamp: Date.now(), // 時間戳記
      Version: 1.5, // 串接程式版本
      MerchantOrderNo: generatedMerchantOrderNo, // 商店訂單編號
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
  },

  // 回傳交易狀態查詢需要的資訊
  /*
  MerchantID: MerchantID
  Version: 1.1
  RespondType: JSON
  CheckValue: getTransitionCheckValue(Amt, MerchantOrderNo)
  TimeStamp: Date.now()
  MerchantOrderNo: MerchantOrderNo
  Amt: Amt
  */

  getTransitionCheckValue: function(Amt, MerchantOrderNo) {
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
}

module.exports = cryptoHelpers
