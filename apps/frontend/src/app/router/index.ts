import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { catalogRoutes } from '../../modules/catalog'
import { favoritesRoutes } from '../../modules/favorites'
import { cartRoutes } from '../../modules/cart'
import { checkoutRoutes } from '../../modules/checkout'

const notFoundRoute: RouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  name: 'not-found',
  meta: { title: 'Page Not Found' },
  component: () =>
    import('../../modules/core').then((module) => module.NotFoundView),
}

/** Application-level composition of the feature modules' routes. */
export const appRoutes: RouteRecordRaw[] = [
  ...catalogRoutes,
  ...favoritesRoutes,
  ...cartRoutes,
  ...checkoutRoutes,
  notFoundRoute,
]

export const router = createRouter({
  history: createWebHistory(),

  routes: appRoutes,

  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition ?? { top: 0 }
  },
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${String(to.meta.title)} · Shelf` : 'Shelf'
})

export default router
