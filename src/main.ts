/*
 * Copyright 2020 NEM (https://nem.io)
 * Copyright 2021-present [Using Blockchain Ltd](https://using-blockchain.org), All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
// external dependencies
import Vue from 'vue';
// @ts-ignore
import { library } from '@fortawesome/fontawesome-svg-core';
// @ts-ignore
import { faFileCsv } from '@fortawesome/free-solid-svg-icons';
// @ts-ignore
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// import vue plugins
import Router from 'vue-router';
import VueRx from 'vue-rx';
import moment from 'vue-moment';
import iView from 'view-design';
import locale from 'view-design/dist/locale/en-US';
import 'view-design/dist/styles/iview.css';
import infiniteScroll from 'vue-infinite-scroll';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import VueNumber from 'vue-number-animation';
import LoadScript from 'vue-plugin-load-script';

// internal dependencies
import { UIBootstrapper } from '@/app/UIBootstrapper';
import { AppStore } from '@/app/AppStore';
import i18n from '@/language/index';
import router from '@/router/AppRouter';
import { VeeValidateSetup } from '@/core/validation/VeeValidateSetup';
// @ts-ignore
import App from '@/app/App.vue';
import clickOutsideDirective from '@/directives/clickOutside';

// plugins provider/injection
import './injecter';
if ('PluginInjecter' in window) {
    console.log('[DEBUG][main.ts] PluginInjecter is now defined');
    Vue.use(window['PluginInjecter']);
}

// define usage of UI plugins
Vue.use(iView, { locale });
Vue.use(moment as any);
Vue.use(Router);
Vue.use(VueRx);
Vue.use(VueNumber);
VeeValidateSetup.initialize();
Vue.use(infiniteScroll);
Vue.use(Toast, {
    closeButton: false,
    timeout: 3000,
    transition: 'Vue-Toastification__fade',
    transitionDuration: 300,
});
Vue.use(LoadScript);
library.add(faFileCsv);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.directive('click-outside', clickOutsideDirective);

// create root instance
const app = new Vue({
    router,
    store: AppStore,
    i18n,
    created: function () {
        // This will execute following processes:
        // - configure Electron
        // - configure Vue directives
        UIBootstrapper.configure(this);
    },
    render: (h) => h(App),
});

// mount virtual DOM
app.$mount('#app');

export default app;
