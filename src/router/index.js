import { createRouter, createWebHistory } from 'vue-router'

// View imports
import HomeView from '@/views/HomeView.vue'
import ScheduleView from '@/views/ScheduleView.vue'
import RecordsView from '@/views/RecordsView.vue'
import CoachesView from '@/views/CoachesView.vue'
import SponsorsView from '@/views/SponsorsView.vue'
import OffSeasonTrainingView from '@/views/OffSeasonTrainingView.vue'
import BoostersView from '@/views/BoostersView.vue'
import HandbookView from '@/views/HandbookView.vue'

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
    },
    {
      path: '/records',
      name: 'records',
      component: RecordsView
    },
    {
      path: '/coaches',
      name: 'coaches',
      component: CoachesView
    },
    {
      path: '/sponsors',
      name: 'sponsors',
      component: SponsorsView
    },
    {
      path: '/off-season-training',
      name: 'off-season-training',
      component: OffSeasonTrainingView
    },
    {
      path: '/boosters',
      name: 'boosters',
      component: BoostersView
    },
    {
      path: '/handbook',
      name: 'handbook',
      component: HandbookView
    }
  ],
})

export default router