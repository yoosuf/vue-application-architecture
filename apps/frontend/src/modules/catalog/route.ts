import type { RouteRecordRaw } from 'vue-router'

export const catalogRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'explore',
    meta: { title: 'Explore' },
    component: () => import('./pages/ExploreView.vue'),
  },
  {
    path: '/books/:id',
    name: 'book-details',
    meta: { title: 'Book Details' },
    component: () => import('./pages/BookDetailsView.vue'),
  },
]
