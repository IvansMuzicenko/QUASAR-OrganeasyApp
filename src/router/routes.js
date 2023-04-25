const routes = [
  {
    path: '/',
    component: () => import('src/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/Index.vue'),
        meta: { parentPath: 'tasks' }
      },
      {
        path: '/:date/:id',
        component: () => import('src/pages/Task.vue'),
        meta: { parentPath: 'tasks' }
      },
      {
        path: '/auth',
        component: () => import('src/pages/Auth.vue'),
        meta: { parentPath: 'auth' }
      },
      {
        path: '/free-tasks',
        component: () => import('src/pages/FreeTasks.vue'),
        meta: { parentPath: 'free-tasks' }
      },
      {
        path: '/free-tasks/:id',
        component: () => import('src/pages/FreeTask.vue'),
        meta: { parentPath: 'free-tasks' }
      },
      {
        path: '/notes',
        component: () => import('src/pages/Notes.vue'),
        meta: { parentPath: 'notes' }
      },
      {
        path: '/notes/:id',
        component: () => import('src/pages/Note.vue'),
        meta: { parentPath: 'notes' }
      },
      {
        path: '/processes',
        component: () => import('src/pages/Processes.vue'),
        meta: { parentPath: 'processes' }
      },
      {
        path: '/categories',
        component: () => import('src/pages/Categories.vue'),
        meta: { parentPath: 'categories' }
      },
      {
        path: '/logs',
        component: () => import('src/pages/TimeLogs.vue'),
        meta: { parentPath: 'logs' }
      },
      {
        path: '/logs-stats',
        component: () => import('src/pages/LogsStats.vue'),
        meta: { parentPath: 'logs-stats' }
      },
      {
        path: '/log-processes',
        component: () => import('src/pages/LogProcesses.vue'),
        meta: { parentPath: 'log-processes' }
      },
      {
        path: '/log-categories',
        component: () => import('src/pages/LogCategories.vue'),
        meta: { parentPath: 'log-categories' }
      },
      {
        path: '/settings',
        component: () => import('src/pages/Settings.vue'),
        meta: { parentPath: 'settings' }
      },
      {
        path: '/help',
        component: () => import('src/pages/Help.vue'),
        meta: { parentPath: 'help' }
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
