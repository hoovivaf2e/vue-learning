import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'index',
    component: () => import('../views/FrontView.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('../views/Home.vue'),
      },
      {
        path: 'product',
        name: 'product',
        component: () => import('../views/ProductView.vue'),
      },
      {
        path: 'productItem/:id',
        name: 'product-item',
        component: () => import('../views/ProductItemView.vue'),
      },
      {
        path: 'cart',
        name: 'cart',
        component: () => import('../views/CartView.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/Dashboard/DashboardView.vue'),
    children: [
      {
        path: 'products',
        name: 'products',
        component: () => import('../views/Dashboard/AdminProducts.vue'),
      },
      {
        path: 'coupon',
        name: 'coupon',
        component: () => import('../views/Dashboard/AdminCoupon.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: 'active',
});

export default router;
