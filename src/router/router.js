import Home from '../components/home/Home.vue'
import About from '../components/about/About.vue'
import Services from '../components/services/services.vue'
import Contact from '../components/contact/contact.vue'
import { createRouter, createWebHistory  } from 'vue-router'

const routes = [
    {
        path: '/',
        component: Home
    },
    {
        path: '/about',
        component: About
    },
    {
        path: '/services',
        component: Services
    },
    {
        path: '/contact',
        component: Contact
    },
    {
        path: '/book',
        component: () => import('../components/book/Book.vue')
    },
    {
        path: '/auth',
        component: () => import('../components/book/Auth.vue')
    }
]



export default createRouter({
    // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
    history: createWebHistory(),
    routes, // short for `routes: routes`
  })