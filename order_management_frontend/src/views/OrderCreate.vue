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
        <div v-else-if="productsStore.error && productsStore.products.length === 0" class="alert alert-warning" role="alert">
          <strong>Unable to load products:</strong> {{ productsStore.error }}
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
                  <p class="mb-2 small" :class="getStockCount(product) > 0 ? 'text-muted' : 'text-danger'">
                    Stock: {{ getStockCount(product) }}
                  </p>
                  <div class="d-flex gap-2">
                    <button 
                      @click="productsStore.addToCart(product)" 
                      class="btn btn-primary flex-grow-1"
                      :disabled="isInCart(product.id) || getStockCount(product) <= 0"
                    >
                      {{ getProductButtonText(product) }}
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
              <div v-if="productsStore.orderError" class="cart-alert mb-3">
                <div>
                  <strong>Stock limit reached</strong>
                  <p class="mb-0">{{ productsStore.orderError }}</p>
                </div>
                <button
                  type="button"
                  class="btn-close"
                  aria-label="Dismiss"
                  @click="productsStore.clearOrderError"
                ></button>
              </div>

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
                            class="quantity-btn"
                            :disabled="item.quantity <= 1"
                          >
                            -
                          </button>
                          <span class="quantity-value">{{ item.quantity }}</span>
                          <button 
                            @click="increaseQuantity(item.product_id)"
                            class="quantity-btn"
                            :disabled="item.stock && item.quantity >= item.stock"
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

const getStockCount = (product) => {
  return Number(product?.stock || 0);
};

const getProductButtonText = (product) => {
  if (isInCart(product.id)) {
    return 'In Cart';
  }

  if (getStockCount(product) <= 0) {
    return 'Out of Stock';
  }

  return 'Add to Cart';
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
    if (item.stock && item.quantity >= item.stock) {
      productsStore.orderError = `Only ${item.stock} item(s) of ${item.name} are available.`;
      return;
    }

    productsStore.clearOrderError();
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

.cart-alert {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid #f5d28a;
  border-radius: 6px;
  color: #664d03;
  background: #fff8e6;
}

.cart-alert p {
  font-size: 0.92rem;
  line-height: 1.35;
}

.quantity-btn {
  width: 34px;
  height: 34px;
  border: 1px solid #adb5bd;
  border-radius: 4px;
  color: #2d3748;
  background: #fff;
}

.quantity-btn:disabled {
  color: #adb5bd;
  background: #f1f3f5;
}

.quantity-value {
  min-width: 28px;
  text-align: center;
  font-weight: 700;
  color: #2d3748;
}

.sticky-top {
  position: sticky;
}
</style>
