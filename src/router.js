import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import PPTPreview from './views/PPTPreview.vue'


Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/preview',
      name: 'PPTPreview',
      component: PPTPreview
    },
    {
      path: '/404',
      component: () => import('@/views/404'),
    },
    {
      path: '*',
      redirect:"/404"
     
    },
  ]
})
