import { createRouter, createWebHistory } from 'vue-router'

// View imports
import HomeView from '@/views/HomeView.vue'
import ScheduleView from '@/views/ScheduleView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
        path: '/schedule',
        name: 'schedule',
        component: ScheduleView
    }
  ],
})

export default router