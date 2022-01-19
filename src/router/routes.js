const routes = [
  {
    path: '/',
    component: () => import('src/layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/Index.vue') },
      { path: '/auth', component: () => import('src/pages/Auth.vue') },
      { path: '/:date/:id', component: () => import('src/pages/Task.vue') },
      {
        path: '/free-tasks',
        component: () => import('src/pages/FreeTasks.vue')
      },
      {
        path: '/free-tasks/:id',
        component: () => import('src/pages/FreeTask.vue')
      },
      {
        path: '/notes',
        component: () => import('src/pages/Notes.vue')
      },
      {
        path: '/notes/:id',
        component: () => import('src/pages/Note.vue')
      },
      {
        path: '/processes',
        component: () => import('src/pages/Processes.vue')
      },
      {
        path: '/settings',
        component: () => import('src/pages/Settings.vue')
      },
      { path: '/help', component: () => import('src/pages/Help.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
