import Vue from 'vue';
import Router from 'vue-router';
import { isLoggedIn } from '../services/isAuth'

Vue.use( Router );

const router = new Router({
    linkActiveClass: "active",
    linkExactActiveClass: "exact-active",
    routes: [
        {
            name: 'home',
            path: '/',
            component: () => import( '@/components/Home'),
            children: [
                {
                    name: 'login',
                    path: '/login',
                    component: () => import( '@/components/Login')
                },
                {
                    name: 'signup',
                    path: '/signup',
                    component: () => import( '@/components/SignUp'),
                },
            ]
        },
        {
            name: 'calendar',
            path: '/calendar',
            component: () => import( '@/components/Calendar')
        },
        {
            name: 'meetings',
            path: '/meetings',
            component: () => import('@/components/Meetings'),
            children: [
                {
                    name: "search-meeting",
                    path: "",
                    component: () => import("@/components/SearchMeeting")
                },
                {
                    name: "add-meeting",
                    path: "add",
                    component: () => import("@/components/AddMeeting")
                }
            ]
        },
        {
            name: 'team',
            path: '/team',
            component: () => import('@/components/Team')
        },
        {
            name: 'users',
            path: '/users',
            component: () => import("@/components/Users")
        },
        {
            name: 'allMeetings',
            path: '/all-meetings',
            component: () => import("@/components/AllMeetings")
        },
        {
            name: 'allTeams',
            path: '/all-teams',
            component: () => import("@/components/AllTeams")
        }
    ]
});

router.beforeEach((to, from, next) => {
    if (to.name !== 'login' && !isLoggedIn() && to.name!=='signup') next({ name: 'login' })
    else if((to.name === 'login' || to.name === 'signup' || to.name === 'home') && isLoggedIn()) next({ name: 'calendar' })
    else next()
  })

export default router;