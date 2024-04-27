// var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const authMiddleware = require("./middleware/authMiddleware");
require("./config/mongoDB.config");

var indexeRouter = require("./routes/index");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// 设置服务器的静态资源路径
app.use(express.static(path.join(__dirname, "public")));

// 使用中间件来验证token
app.use(authMiddleware);

// 接口路由
app.use("/api", indexeRouter);

module.exports = app;
