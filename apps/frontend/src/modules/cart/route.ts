import type { RouteRecordRaw } from 'vue-router'

export const cartRoutes: RouteRecordRaw[] = [
  {
    path: '/cart',
    name: 'cart',
    meta: { title: 'Your Cart' },
    component: () => import('./pages/CartView.vue'),
  },
]