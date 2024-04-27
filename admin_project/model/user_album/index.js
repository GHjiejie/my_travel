const mongoose = require("mongoose");
const userAlbumSchema = new mongoose.Schema({
  // 用户id
  userId: {
    type: String,
    required: true,
  },

  // 相册图片
  albumImages: {
    type: Array,
    default: [],
  },
});
const userAlbumModel = mongoose.model("userAlbum", userAlbumSchema);
module.exports = userAlbumModel;
