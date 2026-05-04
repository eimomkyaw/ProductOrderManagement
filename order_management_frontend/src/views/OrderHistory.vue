<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2>Order History</h2>
          <router-link to="/orders" class="btn btn-outline-primary">
            <i class="bi bi-arrow-left me-2"></i>
            Back to Products
          </router-link>
        </div>
        
        <!-- Loading State -->
        <LoadingSpinner v-if="isLoading" text="Loading order history..." />
        
        <!-- Error State -->
        <div v-else-if="error" class="alert alert-danger" role="alert">
          <strong>Error:</strong> {{ error }}
          <button @click="clearError" class="btn btn-sm btn-outline-danger ms-2">Dismiss</button>
        </div>
        
        <!-- Orders List -->
        <div v-else-if="orders.length > 0">
          <div class="row">
            <div v-for="order in orders" :key="order.id" class="col-lg-6 mb-4">
              <div class="card shadow-sm">
                <div class="card-header d-flex justify-content-between align-items-center">
                  <h6 class="mb-0">Order #{{ order.id }}</h6>
                  <span :class="getStatusBadgeClass(order.status)">
                    {{ order.status }}
                  </span>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <small class="text-muted">Order Date:</small>
                    <p class="mb-1">{{ formatDate(order.created_at) }}</p>
                  </div>
                  
                  <div class="mb-3">
                    <small class="text-muted">Items:</small>
                    <ul class="list-unstyled mb-0">
                      <li v-for="item in order.items" :key="item.id" class="mb-1">
                        {{ item.name }} x {{ item.quantity }} - ${{ (parseFloat(item.pivot?.price) || parseFloat(item.price) || 0 * item.quantity).toFixed(2) }}
                      </li>
                    </ul>
                  </div>
                  
                  <div class="border-top pt-2">
                    <div class="d-flex justify-content-between">
                      <strong>Total:</strong>
                      <strong class="text-primary">${{ order.total_price || order.total }}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-else class="text-center py-5">
          <i class="bi bi-receipt display-1 text-muted"></i>
          <h4 class="mt-3 text-muted">No orders yet</h4>
          <p class="text-muted">Start placing orders to see your order history here.</p>
          <router-link to="/orders" class="btn btn-primary">
            <i class="bi bi-cart-plus me-2"></i>
            Browse Products
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '../axios';
import LoadingSpinner from '../components/LoadingSpinner.vue';

const orders = ref([]);
const isLoading = ref(false);
const error = ref('');


onMounted(async () => {
  await fetchOrders();
});

const fetchOrders = async () => {
  isLoading.value = true;
  error.value = '';
  
  try {
    const response = await axios.get('/auth/orders');
    orders.value = response.data.data || response.data;
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to fetch orders';
  } finally {
    isLoading.value = false;
  }
};

const clearError = () => {
  error.value = '';
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getStatusBadgeClass = (status) => {
  const statusClasses = {
    'pending': 'badge bg-warning text-dark',
    'completed': 'badge bg-success',
    'cancelled': 'badge bg-danger',
    'processing': 'badge bg-info'
  };
  
  return statusClasses[status] || 'badge bg-secondary';
};
</script>
