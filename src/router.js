import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/pages/Home'
import About from '@/pages/About'
import Scoreboard from '@/pages/Scoreboard'
import Challenges from '@/pages/Challenges'
import Profile from '@/pages/Profile'
import Login from '@/pages/Login'
import Signup from '@/pages/Signup'
import Team from '@/pages/Team'
import Admin from '@/pages/Admin'
import Shell from '@/pages/Shell'
import Error404 from '@/pages/Error404'
import Password from '@/pages/Password'
import Verify from '@/pages/Verify'
import Chat from '@/pages/Chat'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/about',
      name: 'About',
      component: About
    },
    {
      path: '/scoreboard',
      name: 'Scoreboard',
      component: Scoreboard
    },
    {
      path: '/challenges',
      name: 'Challenges',
      component: Challenges
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/admin',
      name: 'Admin',
      component: Admin
    },
    {
      path: '/teams/:id',
      name: 'Team',
      component: Team
    },
    {
      path: '/shell',
      name: 'Shell',
      component: Shell
    },
    {
      path: '/resetpassword',
      name: 'Reset Password',
      component: Password
    },
    {
      path: '/verify',
      name: 'Verify',
      component: Verify
    },
    {
      path: '/chat',
      name: 'Chat',
      component: Chat
    },
    {
      path: '/404',
      name: '404',
      component: Error404
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})
