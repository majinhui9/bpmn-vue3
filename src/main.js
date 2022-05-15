import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)
// element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as icons from '@element-plus/icons'
app.use(ElementPlus, { size: 'default', locale: zhCn })
Object.keys(icons).forEach(key => {
  app.component(key, icons[key])
})

import MyPD from "./package/index.js";
app.use(MyPD);
import "./package/theme/index.scss";

app.mount('#app')
