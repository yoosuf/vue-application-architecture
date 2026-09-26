import type { RouteRecordRaw } from 'vue-router'

export const checkoutRoutes: RouteRecordRaw[] = [
  {
    path: '/checkout',
    name: 'checkout',
    meta: { title: 'Checkout' },
    component: () => import('./pages/CheckoutView.vue'),
  },
]
