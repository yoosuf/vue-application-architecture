import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './app/App.vue'
import router from './app/router'
import '@vue-application-architecture/design-system/styles/global.css'

createApp(App).use(createPinia()).use(router).mount('#app')
