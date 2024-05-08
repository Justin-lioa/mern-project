const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRoute = require("./routes").auth;
const courseRoute = require("./routes").course;
const passport = require("passport");
require("./config/passport")(passport);
const cors = require("cors");
const path = require("path");
const port = process.env.PORT || 8080; //在heroku的PORT是動態的會自動設定
//connect mongoDb
mongoose
  .connect(process.env.MONGODB_CONNECTION)
  .then(() => {
    console.log("Connecting to mongodb...");
  })
  .catch((e) => {
    console.log(e);
  });

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, "client", "build")));

app.use("/api/user", authRoute);

//只有登入系統的人(獲得JWT)，才能夠新增課程OR註冊課程
//coruseRoute需要被jwt保護，且驗證過的才可使用
//如果request header內部沒有jwt，則request就會被視為unauthorized
app.use(
  "/api/courses",
  passport.authenticate("jwt", { session: false }),
  courseRoute
);

//目前的express已經是heroku唯一會使用的route,在heroku上面運行server.js時，想要到網站的首頁"/"
// URL/會會跳過前面的route進入下面的route
//process.env.NODE_ENV === "production" ||process.env.NODE_ENV === "staging" 這兩個是heroku自動設定得environment variable，在我們把網站部署到雲端時就會變成production或staging其中之一
//當遇到production的URL後面是接一個 / 時就會來這個route
//send的內容是__dirname裡面的client在找到裡面的build(目前是找不到build，要在部署到雲端才會出現，build裡面會有一個index.html,其實就是在public裡面瘩index.html)
if (
  process.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "staging"
) {
  app.get("*", (req, res) =>
    res.sendFile(path.join(__dirname, "client", "build", "index.html"))
  );
}

app.listen(port, () => {
  console.log("Sever is running on port 8080");
});
