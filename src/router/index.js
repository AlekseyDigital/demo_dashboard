import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../views/Login.vue';
import store from '../store';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    props: (route) => {
      return {
        id: route.params.id,
      };
    },
    meta: { 
      requiresAuth:true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    beforeEnter(to, from, next) {
      if (!store.getters['auth/isAuthenticated']) {
        next({
          query:{ redirect: from.fullPath }
        });
      } else {
        next('/');
      }
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!store.getters['auth/isAuthenticated']) {
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
