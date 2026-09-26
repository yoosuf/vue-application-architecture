export {
  CUSTOMERS_STORAGE_KEY,
  MAGIC_LINK_STORAGE_KEY,
  SESSION_STORAGE_KEY,
  useCustomerStore,
  type Address,
  type AddressInput,
  type Customer,
  type NotificationPrefs,
} from './stores/customer.store'

export { customerRoutes } from './route'
export { default as LoginView } from './pages/LoginView.vue'
export { default as LoginVerifyView } from './pages/LoginVerifyView.vue'
export { default as AccountView } from './pages/AccountView.vue'
