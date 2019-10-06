import Vue from 'vue'
import Router from 'vue-router'
import Edit from '@/components/SessionEdit'
import Create from '@/components/SessionCreate'
import List from '@/components/SessionList'
import LogIn from '@/components/LogIn'
import Voter from '@/components/Voter'
import QRCode from '@/components/QRCodeGeneration'
import Results from '@/components/Results'
import Form from '@/components/Form'
import RemoveCandidate from '@/components/RemoveCandidate'
import RemoveCandidate2 from '@/components/RemoveCandidate2'
import RemoveVoter from '@/components/RemoveVoter'
import ResultsVoter from '@/components/ResultsVoter'
import Groups from '@/components/groups'
import About from '@/components/About'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/edit',
      name: 'Edit',
      component: Edit,
      props: true,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/',
      name: 'List',
      component: List,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'LogIn',
      component: LogIn,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/vote',
      name: 'Voter',
      component: Voter,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/qrcode',
      name: 'QRCode',
      component: QRCode,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/create',
      name: 'Create',
      component: Create,
      props: true,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/groups',
      name: 'Gestion Groupe',
      component: Groups,
      props: true,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/form',
      name: 'Form',
      component: Form,
      meta: {
        requiresAuth: true
      }
    },
        {
      path: '/results',
      name: 'Results',
      component: Results,
      meta: {
        requiresAuth: true
      }

    },
        {
      path: '/removeCandidate',
      name: 'RemoveCandidate',
      component: RemoveCandidate,
      meta: {
        requiresAuth: true
      }
    },
        {
      path: '/removeCandidate2',
      name: 'RemoveCandidate2',
      component: RemoveCandidate2,
      meta: {
        requiresAuth: true
      }
      },
      {
      path: '/publicResults',
      name: 'ResultsVoter',
      component: ResultsVoter,
      meta: {
        requiresAuth: false
      }  
    },
        {
      path: '/removeVoter',
      name: 'RemoveVoter',
      component: RemoveVoter,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/about',
      name: 'À propos',
      component : About,
      meta: {
        requiresAuth: false
      }
    }
  ]
})



import axios from "axios"

let http = 'http://localhost:3001/'

router.beforeEach(async (to, from, next) => {
 /* if(to.path == '/vote'){
    console.log("fuck : " + to.path)
    next(
      {
        path:'/vote'
      }
    )

  } else*/1
1
  if (to.matched.some(record => record.meta.requiresAuth === true)) {
  
    if (localStorage.getItem('token') === null) {
      // if there is no auth token
      next({
        path: '/login',
        params: { nextUrl: to.fullPath }
      })
    } else {
      
      let token = localStorage.getItem('token')

      let valid = await axios.post( http+'login',{authcookie : token})
      .then(response => {
        return response.data.valid
        //console.log(response.data)
      })
      .catch(err =>{
        console.log(err)
      } )
      if (valid) {
        next()
      } else {
        localStorage.removeItem('token');
        next({
          path: '/login',
          params: { nextUrl: to.fullPath }
        })
      }
    }
  } else {
    if(to.path == '/login' && localStorage.getItem("token")!=undefined)
    {
      next({
        path: '/',
      })
    }else{
      next()
    }
  }
  
  
})

export default router
