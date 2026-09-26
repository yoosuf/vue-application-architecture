import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { catalogRoutes } from '../../modules/catalog'
import { cartRoutes } from '../../modules/cart'
import { checkoutRoutes } from '../../modules/checkout'
import { customerRoutes } from '../../modules/customer'

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
  ...cartRoutes,
  ...checkoutRoutes,
  ...customerRoutes,
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
  const title =
    to.name === 'collection' && typeof to.params.category === 'string'
      ? `${to.params.category[0].toUpperCase()}${to.params.category.slice(1)}`
      : to.meta.title
  document.title = title ? `${String(title)} · Shelf` : 'Shelf'
})

export default router
