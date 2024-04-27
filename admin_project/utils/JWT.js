const jsonwebtoken = require("jsonwebtoken");
const secret = "JieJie";
const JWT = {
  // 生成token
  generateToken: (data) => {
    // data是一个对象
    const token = jsonwebtoken.sign(data, secret, { expiresIn: "24h" });
    return token;
  },
  // 验证token
  verifyToken: (token) => {
    try {
      const result = jsonwebtoken.verify(token, secret);
      return result;
    } catch (error) {
      return false;
    }
  },
};
module.exports = JWT;
