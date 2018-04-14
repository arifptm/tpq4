import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

import Student from '@/components/student/Index'
import StudentCreate from '@/components/student/Create'
import ShowStudent from '@/components/student/Show'
import StudentAchievement from '@/components/student/Achievement'

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
      path: '/students/create',
      name: 'StudentCreate',
      component: StudentCreate
    },
    {
      path: '/students/:id',
      name: 'ShowStudent',
      component: ShowStudent
    },
    {
      path: '/students/:id/achievement',
      name: 'StudentAchievement',
      component: StudentAchievement
    },
  ]
})
