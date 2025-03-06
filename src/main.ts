import { createApp } from 'vue'
import Toast, { POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { Quasar } from 'quasar'
import 'quasar/src/css/index.sass'

import './assets/main.css'
import App from './App.vue'
import router from './router'
import pinia from './store'

const app = createApp(App)
const queryClient = new QueryClient()

app.use(Quasar, { plugins: {} })
app.use(pinia)
app.use(router)
app.use(VueQueryPlugin, { queryClient })
app.use(Toast, {
  position: POSITION.TOP_RIGHT,
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
})

app.mount('#app')
