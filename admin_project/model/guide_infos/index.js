const mongoose = require("mongoose");
const guideInfoSchema = new mongoose.Schema({
  // 用户id
  userId: {
    type: String,
    required: true,
  },
  // 导游姓名
  guideName: {
    type: String,
    default: "初级导游",
  },
  // 导游性别
  guideGender: {
    type: String,
  },
  // 导游年龄
  guideAge: {
    type: Number,
  },
  // 导游电话
  guidePhone: {
    type: String,
    default: " 18100000000",
  },
  // 专业证书（系统提供）
  guideCertificate: {
    type: String,
  },
  // 个人简介
  guideIntroduction: {
    type: String,
  },
  // 导游头像
  guideAvatar: {
    type: String,
    default: "http://127.0.0.1:3000/images/default.jpg",
  },
  // 语言
  guideLanguage: {
    type: Array,
    default: ["中文"],
  },
  // 服务区域
  guideServiceArea: {
    type: String,
    default: "北京",
  },
  // 导游注册时间（由系统提供）
  registerTime: {
    type: String,
  },
  // 服务人数
  serveNumber: {
    type: Number,
    default: 0,
  },
  // 个人服务费
  servicePrice: {
    type: Number,
    default: 500,
  },
  // 星级
  starLevel: {
    type: Number,
    default: 5,
  },
  // 从业年限(自动计算)
  workYears: {
    type: Number,
    default: 0,
  },
  // 微信
  wechat: {
    type: String,
  },
  // 邮箱
  email: {
    type: String,
  },
  // 导游等级（系统计算而来）
  guideLevel: {
    type: String,
  },
  // 我的产品
  myProducts: [
    {
      // 产品名称
      productName: {
        type: String,
      },
      // 产品价格
      productPrice: {
        type: Number,
      },
      // 产品出售次数
      productSellNumber: {
        type: Number,
        default: 0,
      },
      // 用户对产品的评分
      userScore: [
        {
          type: Number,
        },
      ],
      // 产品图片
      productImage: [
        {
          path: {
            type: String,
          },
        },
      ],
      // 产品简介
      productIntroduction: {
        type: String,
      },
    },
  ],
  // 用户评价
  // userComments: [
  //   {
  //     type: Object,
  //   },
  // ],
  userComments: [
    {
      // 用户id
      user_id: {
        type: String,
      },
      // 用户头像
      user_avatar: {
        type: String,
      },
      // 用户名
      user_name: {
        type: String,
      },
      // 评分
      user_rating: {
        type: Number,
      },
      user_like: {
        type: Number,
        default: 0,
      },
      // 评论内容
      comment: {
        type: String,
      },
      // 评论时间
      comment_time: {
        type: String,
      },
      // 评论图片
      comment_images: [
        {
          type: String,
        },
      ],
      // 用户回复
      replyList: [
        {
          reply_user_id: {
            type: String,
          },
          reply_content: {
            type: String,
          },
          reply_time: {
            type: String,
          },
          reply_username: {
            type: String,
          },
          reply_avatar: {
            type: String,
          },
          reply_images: [
            {
              type: Object,
            },
          ],
        },
      ],
    },
  ],
});

const guideInfoModel = mongoose.model("guide_infos", guideInfoSchema);
module.exports = guideInfoModel;
