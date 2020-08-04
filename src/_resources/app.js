import Vue from 'vue';
import VueRouter from 'vue-router';
import 'leaflet/dist/leaflet.css';

Vue.use(VueRouter);

window.axios = require('axios');

import Intro from './components/Intro.vue';
import Loading from './components/Loading.vue';
import Cinemas from './components/Cinemas.vue';
import Cinema from './components/Cinema.vue';
import NotFound from './components/404.vue';

const routes = [
  {
    path: '/',
    component: Intro,
    name: 'intro'
  },
  {
    path: '/cinemas',
    component: Cinemas,
    name: 'cinemas',
    children: [
      {
        path: ':slug',
        component: Cinema,
        props: true,
        name: 'cinema'
      },
    ]
  },
  { path: '*', component: NotFound }
]

const router = new VueRouter({
  routes // short for `routes: routes`
})

const app = new Vue({
  router
}).$mount('#app')