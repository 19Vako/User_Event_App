import { createRouter, createWebHistory } from 'vue-router'
import { useAdminStore } from '../../store/store'
import HomeView from '../views/HomeView.vue'
import Log_in from '../views/Log_In.vue'
import Sign_up from '../views/Sign_up.vue'
import User from '../views/User.vue'
import AddUser from '../components/AddUser.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/Log_in'
    },
    {
      path: '/Log_in',
      name: 'LogIn',
      component: Log_in,
    },
    {
      path: '/Home',
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/Sign_up',
      name: 'SignUp',
      component: Sign_up,
    },
    {
      path: '/Add_user',
      name: 'AddUser',
      component: AddUser,
    },
    {
      path: '/User',
      name: 'User',
      component: User,
    },

  ],
})

router.beforeEach((to) => {
  const store = useAdminStore()

  if (!store.login && to.path !== '/Log_in' && to.path !== '/Sign_up') {
    return '/Log_in'
  }
})

export default  router 
