import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@vue-application-architecture/design-system/styles/global.css'
import StoreDemoApp from './StoreDemoApp.vue'

createApp(StoreDemoApp).use(createPinia()).mount('#app')