const usersRouter = require("./users/index");
const usersTravelPlanRouter = require("./users_travel_plan/index");
const usersAlbumRouter = require("./users_album/index");
const usersDynamicsRouter = require("./users_dynamics/index");
const usersFriendsRouter = require("./users_friends/index");
const userChatRouter = require("./chat/index");
const photoHandleRouter = require("./photo_handle/handle");
const guideRouter = require("./guide/index");
const adminRouter = require("./admin/index");
const payRouter = require("./pay/index");
const orderRouter = require("./order/index");
const companinoRouter = require("./companion/index");

const express = require("express");
const router = express.Router();

router.use("/users", usersRouter);
router.use("/travelplan", usersTravelPlanRouter);
router.use("/album", usersAlbumRouter);
router.use("/dynamic", usersDynamicsRouter);
router.use("/friends", usersFriendsRouter);
router.use("/chat", userChatRouter);
router.use("/photo", photoHandleRouter);
router.use("/guide", guideRouter);
router.use("/admin", adminRouter);
router.use("/pay", payRouter);
router.use("/order", orderRouter);
router.use("/companion", companinoRouter);

module.exports = router;
