import Vue from 'vue'
import Router from 'vue-router'
// import designList from '@/pages/designList'

import home from '../pages/home'
import designList from '../pages/design/designList'
import designAbout from '../pages/design/designAbout'
import atlasList from '../pages/design/atlasList'
import atlasDetails from '../pages/design/atlasDetails'
import evaluateList from '../pages/designOrder/evaluateList'
import designOrder from '../pages/designOrder/designOrder'
import designOrderDetails from '../pages/designOrder/designOrderDetails'
import designOrderEva from '../pages/designOrder/designOrderEva'
import refundDetails from '../pages/designOrder/refundDetails'
import refundApplication from '../pages/designOrder/refundApplication'
import fabiao from '../pages/fabiao/fabiao'
import fabiaoList from '../pages/fabiao/fabiaoList'
import fabiaoDetails from '../pages/fabiao/fabiaoDetails'
import supervisionOrder from '../pages/supervision/supervisionOrder'
import supervisionOrderDetails from '../pages/supervision/supervisionOrderDetails'
import supervisionRefundApply from '../pages/supervision/supervisionRefundApply'
import supervisionRefundDetails from '../pages/supervision/supervisionRefundDetails'
import supervisionOrderEva from '../pages/supervision/supervisionOrderEva'
import designAppointment from '../pages/bespeak/designAppointment'
import appointmentDetails from '../pages/bespeak/appointmentDetails'
import bespeak from '../pages/bespeak/bespeak'
import biaoshuDetails from '../pages/biaoshu/biaoshuDetails'
import biaoshuDone from '../pages/biaoshu/biaoshuDone'
import ordersHall from '../pages/ordersHall'
import designBase from '../pages/designBase'

Vue.use(Router)



const routes = [
	{
	  path: '/home',
	  component: home,
      children: [
      	{
          path: '/',
          component: designBase
        },
        {
          path: '/atlasDetails',
          component: atlasDetails
        },
        {
          path: '/designAbout',
          component: designAbout
        },
        {
          path: '/designList',
          component: designList
        },
        {
          path: '/designAppointment',
          component: designAppointment
        },
        {
          path: '/appointmentDetails',
          component: appointmentDetails
        },
        {
          path: '/evaluateList',
          component: evaluateList
        },
        {
          path: '/designOrder',
          component: designOrder
        },
        {
          path: '/designOrderDetails',
          component: designOrderDetails
        },
        {
          path: '/designOrderEva',
          component: designOrderEva
        },
        {
          path: '/refundDetails',
          component: refundDetails
        },  
        {
          path: '/refundApplication',
          component: refundApplication
        },        
        {
          path: '/fabiao',
          component: fabiao
        },
        {
          path: '/fabiaoList',
          component: fabiaoList
        },
        {
          path: '/fabiaoDetails',
          component: fabiaoDetails
        },
        {
          path: '/supervisionOrder',
          component: supervisionOrder
        },
        {
          path: '/supervisionOrderDetails',
          component: supervisionOrderDetails
        },
        {
          path: '/supervisionRefundApply',
          component: supervisionRefundApply
        },
        {
          path: '/supervisionRefundDetails',
          component: supervisionRefundDetails
        },
        {
          path: '/supervisionOrderEva',
          component: supervisionOrderEva
        },
        {
          path: '/bespeak',
          component: bespeak
        },
        {
          path: '/biaoshuDetails',
          component: biaoshuDetails
        },
        {
          path: '/biaoshuDone',
          component: biaoshuDone
        },
        {
          path: '/ordersHall',
          component: ordersHall
        },
        {
          path: '/designBase',
          component: designBase
        },
        {
          path: '/atlasList',
          component: atlasList
        }
      ],
	},
  {
    path: '/',
    component: home,
    children: [
      {
        path: '/',
        component: designBase
      }
    ]
  }
]


export default new Router({routes})
