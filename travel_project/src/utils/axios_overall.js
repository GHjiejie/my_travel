import axios from "axios";
// Add a request interceptor
axios.interceptors.request.use(
  function (config) {
    // console.log("我是axios拦截器");
    const token = localStorage.getItem("token_two");
    //  将authorization设置到请求头里面,确保后面的每一次请求都会携带token
    config.headers.authorization = `${token}`;
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    // 从响应头里面获取authorization
    const { authorization } = response.headers;
    // 将authorization设置到sessionStorage里面;
    localStorage.setItem("token_two", authorization);
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

// export default axios;
