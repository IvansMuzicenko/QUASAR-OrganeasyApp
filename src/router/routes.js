const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/auth', component: () => import('pages/Auth.vue') },
      { path: '/help', component: () => import('src/pages/Help.vue') },
      {
        path: '/notes',
        component: () => import('src/pages/Notes.vue')
      },
      {
        path: '/notes/:title',
        component: () => import('pages/Note.vue')
      },
      { path: '/:date/:title', component: () => import('pages/Task.vue') },
      {
        path: '/processes',
        component: () => import('src/pages/Processes.vue')
      }
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
