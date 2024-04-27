const express = require("express");
const router = express.Router();
const usersTravelPlanService = require("../../services/usersTravelPlanService/index");

// 用户更新自己的出行计划
router.put("/:id", usersTravelPlanService.updateTravelPlanById);
// 用户添加出行计划
router.post("/", usersTravelPlanService.addTravelPlan);

// 用户获取自己的出行计划;
router.get("/", usersTravelPlanService.getTravelPlanByUserId);

// 用户删除自己的出行计划
router.delete("/", usersTravelPlanService.deleteTravelPlanById);

// 用户获取自己的当前出行计划(用于修改当个计划)
router.get("/currentplan", usersTravelPlanService.getCurrentPlan);

module.exports = router;
