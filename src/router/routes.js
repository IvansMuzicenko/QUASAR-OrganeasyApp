const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/Index.vue") },
      { path: "/help", component: () => import("src/pages/Help.vue") },
      { path: "/calendar", component: () => import("src/pages/Calendar.vue") },
      {
        path: "/global-tasks",
        component: () => import("src/pages/GlobalTasks.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
