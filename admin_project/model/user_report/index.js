const mongoose = require("mongoose");
const userRebortSchema = new mongoose.Schema({
  // 被举报用户id
  reported_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  // 举报原因
  report_reason: {
    type: String,
  },
  // 举报人id
  reporter_user_id: {
    type: String,
  },
});

const userReportModel = mongoose.model("userReports", userRebortSchema);
module.exports = userReportModel;
