import type { RouteRecordRaw } from 'vue-router'

export const favoritesRoutes: RouteRecordRaw[] = [
  {
    path: '/favorites',
    name: 'favorites',
    meta: { title: 'Favorites' },
    component: () => import('./pages/FavoritesView.vue'),
  },
]
