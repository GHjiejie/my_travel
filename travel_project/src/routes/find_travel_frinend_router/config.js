const FriendRoutes = [
  {
    path: "detail/:id",
    name: "detail",
    component: () =>
      import(
        "../../components/user_component/user_friends_component/UFC_detail/index.vue"
      ),
  },
];

export default FriendRoutes;
