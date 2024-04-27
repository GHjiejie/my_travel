const adminModel = require("../../model/admin/index");

const adminController = {
  login: async (username, password) => {
    const isExist = await adminModel.findOne({ username });
    // 判断用户是否存在
    if (isExist === null) {
      return {
        code: 404,
        msg: "用户名不存在,请先注册",
      };
    }
    const result = await adminModel.findOne({
      username: username,
      password: password,
    });
    if (result === null) {
      return {
        code: 401,
        msg: "用户名或密码错误",
      };
    }

    return {
      code: 200,
      msg: "登录成功",
      data: result,
    };
  },
  register: async (username, password, phone) => {
    // 首先判断用户是否存在
    const isExist = await adminModel.findOne({ username: username });
    if (isExist) {
      return {
        code: 401,
        msg: "用户名已存在,请直接登录",
      };
    }
    const result = await adminModel.create({
      username: username,
      password: password,
      phone: phone,
    });
    return {
      code: 200,
      msg: "注册成功",
      data: result,
    };
  },
};
module.exports = adminController;
