const JWT = require("../utils/JWT");

const authMiddleware = (req, res, next) => {
  if (req.url.includes("login") || req.url.includes("register")) {
    // console.log("当前接口不需要验证" + req.url);
    next();
  } else {
    // 获取请求头中的token，用户登录成功后会在响应头里面设置token，我们需要获取他
    const token = req.headers.authorization;
    // console.log("token", token);
    if (token) {
      const result = JWT.verifyToken(token);
      if (result) {
        // 验证通过，更新token
        const newToken = JWT.generateToken({
          username: result.username,
          password: result.password,
        });
        // 在响应头里面设置新的token,被axios拦截器拦截
        res.header("authorization", newToken);
        next();
      } else {
        res.send({
          code: 401,
          msg: "token验证失败，请重新登录",
        });
      }
    }
  }
};

module.exports = authMiddleware;
