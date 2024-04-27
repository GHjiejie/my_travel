const adminController = require("../../controller/adminController/index.js");
const JWT = require("../../utils/jwt");
const adminService = {
  // 管理员登录功能
  login: async (req, res) => {
    const { username, password } = req.body;
    const result = await adminController.login(username, password);
    if (result.code === 200) {
      // 创建token
      const token = JWT.generateToken({ username, password });
      // 将token返回给前端，用axios拦截器将token存储在localStorage中
      res.header("authorization", token);
      res.json(result);
    } else {
      res.json(result);
    }
  },
  register: async (req, res) => {
    const { username, password, phone } = req.body;
    const result = await adminController.register(username, password, phone);
    res.json(result);
  },
};
module.exports = adminService;
