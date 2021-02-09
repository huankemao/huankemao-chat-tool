import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui' // 组件
import 'element-ui/lib/theme-chalk/index.css' // 样式
import '@/assets/icon/iconfont.css'
Vue.use(ElementUI) // 注册
Vue.config.productionTip = false
// yar
new Vue({
  render: h => h(App),
}).$mount('#app')