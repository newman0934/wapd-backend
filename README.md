# wapd-backend

為男裝服飾打造的 Vue.js/Node.js Express 前後端分離專案，採用 MySQL 作為資料庫，此為後端伺服器並仍處於開發階段，伺服器已布署於 [heroku](https://wapd-backend.herokuapp.com/api/) 上，您可以 [在此看見](https://newman0934.github.io/wapd-frontend/#/index) 開發中前端網頁目前的成品。

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

於根目錄開啟 config/config.json，確保您在 MySQL workbench 中的設定檔與 config.json 中相符。

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

於 MySQL workbench 中建立 wapd_backend 資料庫，並於專案根目錄中建立 migration。輸入：

```
npx sequelize db:migrate
```

建立種子檔案，請輸入：

```
npx sequelize db:seed:all
```

啟動伺服器，請輸入：

```
npm run dev
```

## 專案分工

前端開發
[Caesar Wang](https://github.com/newman0934)
[YunYuLo](https://github.com/YunYuLo)
後端開發
[Eason Lin](https://github.com/EasonLin0716)

此專案仍處於開發階段， 2020 年 1 月下旬初版釋出後會完善這份文件。若您對這份專案有任何更好的建議，請不吝聯繫我們，謝謝您
