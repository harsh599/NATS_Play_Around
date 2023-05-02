import { createRouter, createWebHistory } from 'vue-router'
import  Home  from "../components/Home.vue"
import UserDetails from "../components/UserDetails.vue"
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/user-details',
      name: 'User Details',
      component: UserDetails
    },
  ]
})

export default router
