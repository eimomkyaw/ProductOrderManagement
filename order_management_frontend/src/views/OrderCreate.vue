<template>
  <div class="container-fluid py-4">
    <div class="row">
      <!-- Products Section -->
      <div class="col-lg-8">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="mb-0">Products</h2>
          <div class="d-flex gap-2">
            <button @click="refreshProducts" class="btn btn-outline-primary btn-sm" :disabled="productsStore.isLoading">
              <i class="bi bi-arrow-clockwise"></i> Refresh
            </button>
          </div>
        </div>
        
        <!-- Loading State -->
        <LoadingSpinner v-if="productsStore.isLoading" text="Loading products..." />
        
        <!-- Error State -->
        <div v-else-if="productsStore.error" class="alert alert-danger" role="alert">
          <strong>Error:</strong> {{ productsStore.error }}
          <button @click="productsStore.clearError" class="btn btn-sm btn-outline-danger ms-2">Dismiss</button>
        </div>
        
        <!-- Products Grid -->
        <div v-else class="row">
          <div v-for="product in filteredProducts" :key="product?.id || Math.random()" class="col-md-6 col-lg-4 mb-4">
            <div v-if="product && product.id" class="card h-100 shadow-sm hover-card">
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">{{ product.name || 'Unknown Product' }}</h5>
                <p v-if="product.description" class="card-text text-muted flex-grow-1">{{ product.description }}</p>
                <div class="mt-auto">
                  <h4 class="text-primary">${{ parseFloat(product.price || 0).toFixed(2) }}</h4>
                  <div class="d-flex gap-2">
                    <button 
                      @click="productsStore.addToCart(product)" 
                      class="btn btn-primary flex-grow-1"
                      :disabled="isInCart(product.id)"
                    >
                      {{ isInCart(product.id) ? 'In Cart' : 'Add to Cart' }}
                    </button>
                    <button 
                      v-if="isInCart(product.id)"
                      @click="productsStore.removeFromCart(product.id)"
                      class="btn btn-outline-danger"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-if="!productsStore.isLoading && !productsStore.error && productsStore.products.length === 0" 
             class="text-center py-5">
          <i class="bi bi-box-seam display-1 text-muted"></i>
          <h4 class="mt-3 text-muted">No products available</h4>
          <p class="text-muted">Check back later for new products.</p>
        </div>
        
        <!-- Pagination -->
        <div v-if="!productsStore.isLoading && !productsStore.error && productsStore.pagination.totalPages > 1" 
             class="d-flex justify-content-center align-items-center gap-2 mb-4">
          <button @click="productsStore.previousPage" 
                  class="btn btn-outline-secondary" 
                  :disabled="!productsStore.pagination.prevPageUrl || productsStore.isLoading">
            <i class="bi bi-chevron-left"></i> Previous
          </button>
          
          <span class="pagination-info">
            Page {{ productsStore.pagination.currentPage }} of {{ productsStore.pagination.totalPages }}
          </span>
          
          <button @click="productsStore.nextPage" 
                  class="btn btn-outline-secondary" 
                  :disabled="!productsStore.pagination.nextPageUrl || productsStore.isLoading">
            Next <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>

      <!-- Cart Section -->
      <div class="col-lg-4">
        <div class="sticky-top" style="top: 20px;">
          <div class="card shadow">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0 d-flex justify-content-between align-items-center">
                <span>Your Cart</span>
                <span class="badge bg-light text-primary">{{ productsStore.cartItemCount }}</span>
              </h5>
            </div>
            
            <div class="card-body">
              <!-- Empty Cart -->
              <div v-if="productsStore.cart.length === 0" class="text-center py-4">
                <i class="bi bi-cart-x display-4 text-muted"></i>
                <p class="mt-2 text-muted">Your cart is empty</p>
              </div>
              
              <!-- Cart Items -->
              <div v-else>
                <div class="cart-items mb-3" style="max-height: 300px; overflow-y: auto;">
                  <div v-for="item in productsStore.cart" :key="item.product_id" 
                       class="cart-item mb-2 p-2 border rounded">
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="flex-grow-1">
                        <h6 class="mb-1">{{ item.name }}</h6>
                        <div class="d-flex align-items-center gap-2">
                          <button 
                            @click="decreaseQuantity(item.product_id)"
                            class="btn btn-sm btn-outline-secondary"
                            :disabled="item.quantity <= 1"
                          >
                            -
                          </button>
                          <span class="fw-bold">{{ item.quantity }}</span>
                          <button 
                            @click="increaseQuantity(item.product_id)"
                            class="btn btn-sm btn-outline-secondary"
                          >
                            +
                          </button>
                          <span class="text-muted ms-2">
                            ${{ (getProductPrice(item.product_id) * item.quantity).toFixed(2) }}
                          </span>
                        </div>
                      </div>
                      <button 
                        @click="productsStore.removeFromCart(item.product_id)"
                        class="btn btn-sm btn-outline-danger"
                      >
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
                
                <!-- Cart Summary -->
                <div class="border-top pt-3">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="mb-0">Total:</h5>
                    <h4 class="mb-0 text-primary">${{ productsStore.cartTotal.toFixed(2) }}</h4>
                  </div>
                  
                  <button 
                    @click="submitOrder" 
                    class="btn btn-success w-100"
                    :disabled="productsStore.orderLoading"
                  >
                    <span v-if="productsStore.orderLoading" class="spinner-border spinner-border-sm me-2"></span>
                    {{ productsStore.orderLoading ? 'Placing Order...' : 'Place Order' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Notification Toast -->
  <NotificationToast
    :show="showNotification"
    :message="notificationMessage"
    :type="notificationType"
    @close="closeNotification"
  />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useProductsStore } from '../stores/products';
import { useAuthStore } from '../stores/auth';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import NotificationToast from '../components/NotificationToast.vue';

const productsStore = useProductsStore();
const authStore = useAuthStore();

const showNotification = ref(false);
const notificationMessage = ref('');
const notificationType = ref('success');

// Filter out null/undefined products to prevent errors
const filteredProducts = computed(() => {
  return productsStore.products.filter(product => product && product.id);
});

onMounted(async () => {
  await productsStore.fetchProducts();
});

const isInCart = (productId) => {
  return productsStore.cart.some(item => item.product_id === productId);
};

const getProductPrice = (productId) => {
  const item = productsStore.cart.find(item => item.product_id === productId);
  if (item) {
    return parseFloat(item.price || 0);
  }

  const product = productsStore.getProductById(productId);
  return product ? parseFloat(product.price || 0) : 0;
};

const increaseQuantity = (productId) => {
  const item = productsStore.cart.find(item => item.product_id === productId);
  if (item) {
    productsStore.updateQuantity(productId, item.quantity + 1);
  }
};

const decreaseQuantity = (productId) => {
  const item = productsStore.cart.find(item => item.product_id === productId);
  if (item && item.quantity > 1) {
    productsStore.updateQuantity(productId, item.quantity - 1);
  }
};

const refreshProducts = async () => {
  await productsStore.fetchProducts();
};

const submitOrder = async () => {
  const result = await productsStore.submitOrder();
  
  if (result.success) {
    showNotification.value = true;
    notificationMessage.value = 'Order placed successfully!';
    notificationType.value = 'success';
  } else {
    showNotification.value = true;
    notificationMessage.value = result.error;
    notificationType.value = 'error';
  }
};

const closeNotification = () => {
  showNotification.value = false;
  productsStore.clearError();
};
</script>

<style scoped>
.hover-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.hover-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.cart-item {
  background-color: #f8f9fa;
  transition: background-color 0.2s ease;
}

.cart-item:hover {
  background-color: #e9ecef;
}

.sticky-top {
  position: sticky;
}
</style>
