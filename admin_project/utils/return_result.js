const returnResult = {
  // 请求成功
  success: (result) => {
    return {
      code: 200,
      msg: "success",
      data: result,
    };
  },
  // 请求失败
  fail: () => {
    return {
      code: 400,
      msg: "fail",
    };
  },
  // 用户已经存在
  userHasExist: () => {
    return {
      code: 401,
      msg: "用户名已经存在",
    };
  },
  // 账号或者密码错误
  accountOrPasswordError: () => {
    return {
      code: 402,
      msg: " 账号或者密码错误",
    };
  },
};
module.exports = returnResult;
