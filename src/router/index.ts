import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import Participant from '../views/Participant.vue'
import Expense from '../views/Expense.vue'
import Balance from '../views/Balance.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/participants',
    name: 'Người tham gia',
    component: Participant,
  },
  {
    path: '/expenses',
    name: 'Chi tiêu',
    component: Expense,
  },
  {
    path: '/balances',
    name: 'Tổng kết số dư',
    component: Balance,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
