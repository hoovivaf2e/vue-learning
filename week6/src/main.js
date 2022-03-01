import { createApp } from 'vue';

import axios from 'axios';
import VueAxios from 'vue-axios';

import {
  Form, Field, ErrorMessage, defineRule, configure,
} from 'vee-validate';
import AllRules from '@vee-validate/rules';
import { localize, setLocale } from '@vee-validate/i18n';
import TW from '@vee-validate/i18n/dist/locale/zh_TW.json';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App.vue';
import router from './router';

Object.keys(AllRules).forEach((rule) => {
  defineRule(rule, AllRules[rule]);
});

configure({
  generateMessage: localize({ zh_TW: TW }), // 載入繁體中文語系
  validateOnInput: true, // 輸入後直接進行驗證
});
// 設定語系
setLocale('zh_TW');

createApp(App)
  .use(router)
  .use(VueAxios, axios)
  .component('Form', Form)
  .component('Field', Field)
  .component('ErrorMessage', ErrorMessage)
  .mount('#app');
