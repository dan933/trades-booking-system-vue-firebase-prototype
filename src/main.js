import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Vuetify from './plugins/vuetify.js'
import Router from './router/router.js'

createApp(App)
.use(Router)
.use(Vuetify)
.mount('#app')