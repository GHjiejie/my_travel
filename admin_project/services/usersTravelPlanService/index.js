const userTravelPlanController = require("../../controller/userTravelPlanController/index");
const returnResult = require("../../utils/return_result");
const usersTravelPlanService = {
  // 用户添加出行计划
  addTravelPlan: async (req, res) => {
    const data = req.body;
    const { id } = req.query;
    const result = await userTravelPlanController.addTravelPlan(id, data);
    if (result) {
      res.json(returnResult.success(result));
    } else {
      res.json(returnResult.fail());
    }
  },

  // // 用户获取自己的出行计划(所有的出行计划，分页查询)
  getTravelPlanByUserId: async (req, res) => {
    const { userId, pageSize, currentPage } = req.query;
    // console.log("userId", userId);
    // console.log("pageSize", pageSize);
    // console.log("currentPage", currentPage);
    const skipNum = (currentPage - 1) * pageSize;
    const result = await userTravelPlanController.getTravelPlanByUserId(
      userId,
      pageSize,
      skipNum
    );
    if (result) {
      res.json(returnResult.success(result));
    } else {
      res.json(returnResult.fail());
    }
  },
  // 修改用户的单个计划
  getCurrentPlan: async (req, res) => {
    const { travelId } = req.query;
    const result = await userTravelPlanController.getCurrentPlan(travelId);
    if (result) {
      res.json(returnResult.success(result));
    } else {
      res.json(returnResult.fail());
    }
  },

  // // 用户更新自己的出行计划
  updateTravelPlanById: async (req, res) => {
    // const { id } = req.query;
    const { id } = req.params;
    const data = req.body;
    const result = await userTravelPlanController.updateTravelPlanById(
      id,
      data
    );
    if (result) {
      res.json(returnResult.success(result));
    } else {
      res.json(returnResult.fail());
    }
  },

  // 用户删除自己的出行计划
  deleteTravelPlanById: async (req, res) => {
    const { travelId, userId } = req.query;
    const result = await userTravelPlanController.deleteTravelPlanById(
      travelId,
      userId
    );
    if (result) {
      res.json(returnResult.success(result));
    } else {
      res.json(returnResult.fail());
    }
  },
};

module.exports = usersTravelPlanService;
