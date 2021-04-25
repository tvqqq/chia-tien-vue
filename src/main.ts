import { createApp } from 'vue'

// Library
import router from './router'
import { store, key } from './store'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import '@/assets/styles/tailwind.css'

// Internal
import App from './App.vue'
import '@/assets/styles/scss/style.scss'

const app = createApp(App)

app.use(Antd).use(store, key).use(router).mount('#app')
