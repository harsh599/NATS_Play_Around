import { createRouter, createWebHistory } from 'vue-router'
import  Home  from "../components/Home.vue"
import UserDetails from "../components/UserDetails.vue"
import NatsSubscription from "../components/NatsSubscription.vue"
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
    {
      path: '/nats-subscription',
      name: 'Nats Subscription',
      component: NatsSubscription
    },
  ]
})

export default router
