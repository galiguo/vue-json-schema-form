/*
 * @Author: zhanganqi01
 * @Date: 2024-07-04 17:11:10
 * @LastEditTime: 2024-07-09 16:13:38
 * @FilePath: /configured-fe/packages/demo/demo-v2/src/pages/index/index.js
 * @Description: 添加自定义组件
 */

import 'demo-common/bootstrap.js';
import Vue from 'vue';
import VueRouter from 'VueRouter';
import elementUI from 'demo-common/components/ElementUi/index.js';
import ExtraComponents from 'demo-common/components/widget-components/index.js'

import routes from './routes';

import App from './App';

import './style.css';

Vue.use(VueRouter);

// Ui
Vue.use(elementUI);
console.log('ExtraComponents------', ExtraComponents)
Object.entries(ExtraComponents).forEach(([key, value]) => {
    Vue.component(key, value)
})

new Vue({
    router: new VueRouter({
        mode: 'hash',
        routes,
        scrollBehavior() {
            return { x: 0, y: 0 };
        }
    }),
    render: h => h(App)
}).$mount('#app');
