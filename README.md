# wapd-backend

[![](https://coveralls.io/repos/github/EasonLin0716/wapd-backend/badge.svg)](https://travis-ci.org/EasonLin0716/wapd-backend) [![Heroku](https://heroku-badge.herokuapp.com/?app=t-wapd-backend&root=api-docs)](https://wapd-backend.herokuapp.com/api-docs/) [![](https://travis-ci.org/EasonLin0716/wapd-backend.svg?branch=master)](https://travis-ci.org/EasonLin0716/wapd-backend)

為男裝服飾打造的 Vue.js/Node.js Express 前後端分離專案，採用 MySQL 作為資料庫，此為後端伺服器專案，伺服器已布署於 [heroku](https://wapd-backend.herokuapp.com/api/) 上，您可以 [在此看見](https://newman0934.github.io/wapd-frontend/#/index) 我們的成品。

## 專案緣起

專案緣起於 Alpha Camp 第四學期畢業專題發想，團隊共同決議要選擇「電商平台」為主題，利用 Vue 及 Node.js Express 打造前後端分離的作品，期望透過技術降低傳統店家要拓展線上通路的進入門檻。

剛好我們遇見了 APEX DANDY 的老闆，因為在台中同時擁有兩個不同風格男裝品牌- APEX DANDY(潮流服飾) ＆ DREAM MAN(特色西服)，希望有一個平台能整合實體店面的商品，讓他們的夢想觸及更多的消費者。

因此，以兩家店為基礎發想了 WAP-D 網路品牌，結合我們的技術為店家建立一個可以輕鬆開店的網路平台，擁有一條龍的前後台功能。

## 專案功能

產品將使用者分為三個角色：使用者（未登入）、會員（已登入）及管理員（擁有 admin 權限者）

- 會員功能

  - 使用者可以註冊成為會員，並作為會員登入
  - 會員可以變更、或在忘記密碼時透過信箱收到的連結重設密碼
  - 會員可以查詢自己的所有訂單及其中一筆訂單的狀況
  - 會員在兩小時內未支付已成立的訂單時，系統會將其標記為失效
  - 會員可以將喜歡的商品加入 Wishlist 或自其移除

- 商品

  - 使用者可以在首頁看到最新商品資訊
  - 使用者可以瀏覽所有商品及單一商品詳細資訊
  - 使用者可以透過分類瀏覽不同商品

- 購物車

  - 使用者可以將商品加入購物車
  - 會員可以瀏覽購物車的內容
  - 會員可以在購物車中刪除或變動商品數量
  - 會員可以在購物車中輸入優惠序號

- 結帳

  - 會員可以選擇超商取貨、超商取貨付款或宅配
  - 會員可以通過藍新金流刷卡
  - 會員完成結帳後可收到一封訂單成立的信

- 後台
  - 管理者可以針對商品、類別等 CRUD
  - 管理者可以透過交易查詢鈕更新訂單的付款狀態

## 產品

您可以在[前端專案](https://github.com/newman0934/wapd-frontend)看見產品的照片及更詳細的內容

## 資料庫架構

關於 ERD，可參考[資料庫架構規劃](https://drive.google.com/file/d/1TCItglC5sX0VC8NGjZSR_zfzqQeeoraD/view)

## API 文件

若要查看 API 文件，可在安裝後於本地 /api-docs 觀看，或是於 [heroku](https://wapd-backend.herokuapp.com/api-docs/) 直接觀看 API 文件

## 安裝

此專案以 Node.js/Express 搭配 MySQL 作為資料庫，安裝本地版本前請確保您已安裝了 MySQL workbench, sequelize-cli 以及 npm。

在本地開啟終端機，輸入

```
https://github.com/newman0934/wapd-backend.git
```

安裝所需套件，請輸入

```
npm install
```

本專案使用了 dotenv 隱藏了部分敏感資訊，若要完整跑起伺服器，請確保您已準備了以下所需：

```
# JWT_SECRET: JWT SECRET(e.g. secret)
JWT_SECRET=
# EMAIL: 信箱帳號密碼，務必輸入正確
EMAIL_ACCOUNT=
EMAIL_PASSWORD=
# URL: 上線用的URL，可用 ngrok 仿一個
URL=
# 藍新商店代號及金鑰
MERCHANT_ID=
HASH_KEY=
HASH_IV=
# IMGUR API 金鑰
IMGUR_CLIENT_ID=
# 本地資料庫中的帳號密碼(此為範例，請更改為您的設定)
CONFIG_USER_NAME=root
CONFIG_USER_PASS=password
```

您可以在根目錄 .env.example 中找到 .env 檔案的範例

於根目錄開啟 config/config.js，確保您在 MySQL workbench 中的設定檔與 config.json 中相符。

```
{
  "development": {
    "username": "root",
    "password": 您資料庫的密碼,
    "database": "wapd_backend",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
//...
```

於 MySQL workbench 中建立 wapd_backend 及測試用 wapd_backend_test 資料庫，並於專案根目錄中建立 migration。輸入：

```
npx sequelize db:migrate
npx sequelize db:migrate --env test
```

建立種子檔案，請輸入：

```
npx sequelize db:seed:all
npx sequelize db:seed:all --env test
```

啟動伺服器，請輸入：

```
npm run dev
```

進行自動化測試，請輸入：

```
npm run test
```

## 專案分工

前端開發

[Caesar Wang](https://github.com/newman0934)

[YunYuLo](https://github.com/YunYuLo)

後端開發

[Eason Lin](https://github.com/EasonLin0716)

對於這份專案有任何可以建議或改進的地方，請不吝告知我們，謝謝您！
