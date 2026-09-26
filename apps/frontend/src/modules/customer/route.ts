import type { RouteRecordRaw, RouteRecordName } from 'vue-router'
import { useCustomerStore } from './stores/customer.store'

function requireSignedIn(redirect: RouteRecordName) {
  return () => {
    if (useCustomerStore().isSignedIn) return undefined
    return { name: 'login', query: { redirect } }
  }
}

export const customerRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    meta: { title: 'Log In' },
    component: () => import('./pages/LoginView.vue'),
    beforeEnter: () => {
      if (useCustomerStore().isSignedIn) return { name: 'account-orders' }
      return undefined
    },
  },
  {
    path: '/login/verify',
    name: 'login-verify',
    meta: { title: 'Log In' },
    component: () => import('./pages/LoginVerifyView.vue'),
  },
  {
    path: '/account',
    redirect: { name: 'account-orders' },
  },
  {
    path: '/account/orders',
    name: 'account-orders',
    meta: { title: 'Your Orders' },
    component: () => import('./pages/AccountView.vue'),
    beforeEnter: requireSignedIn('account-orders'),
  },
  {
    path: '/account/profile',
    name: 'account-profile',
    meta: { title: 'Your Profile' },
    component: () => import('./pages/AccountView.vue'),
    beforeEnter: requireSignedIn('account-profile'),
  },
  {
    path: '/account/favorites',
    name: 'account-favorites',
    meta: { title: 'Your Favorites' },
    component: () => import('./pages/AccountView.vue'),
    beforeEnter: requireSignedIn('account-favorites'),
  },
  {
    path: '/account/settings',
    name: 'account-settings',
    meta: { title: 'Account Settings' },
    component: () => import('./pages/AccountView.vue'),
    beforeEnter: requireSignedIn('account-settings'),
  },
  {
    path: '/account/addresses',
    name: 'account-addresses',
    meta: { title: 'Your Addresses' },
    component: () => import('./pages/AccountView.vue'),
    beforeEnter: requireSignedIn('account-addresses'),
  },
]
