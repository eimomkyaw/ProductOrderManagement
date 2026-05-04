import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import Login from '../views/Login.vue';
import OrderCreate from '../views/OrderCreate.vue';
import OrderHistory from '../views/OrderHistory.vue';

const routes = [
    { 
        path: '/', 
        redirect: '/orders'
    },
    { 
        path: '/login', 
        component: Login,
        meta: { requiresGuest: true }
    },
    { 
        path: '/orders', 
        component: OrderCreate,
        meta: { requiresAuth: true }
    },
    { 
        path: '/orders/history', 
        component: OrderHistory,
        meta: { requiresAuth: true }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// Navigation guards
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    
    // Check if route requires authentication
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next('/login');
        return;
    }
    
    // Check if route requires guest (not authenticated)
    if (to.meta.requiresGuest && authStore.isAuthenticated) {
        next('/orders');
        return;
    }
    
    next();
});

export default router;