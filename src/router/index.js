import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

import Student from '@/components/student/Index'
import ShowStudent from '@/components/student/Show'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/students',
      name: 'Student',
      component: Student
    },
    {
      path: '/students/:id',
      name: 'ShowStudent',
      component: ShowStudent
    },
  ]
})
