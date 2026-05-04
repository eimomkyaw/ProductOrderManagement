<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import NotificationToast from '../components/NotificationToast.vue';

const authStore = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const showNotification = ref(false);
const notificationMessage = ref('');
const notificationType = ref('error');

const emailError = ref('');
const passwordError = ref('');

const validateForm = () => {
  let isValid = true;
  
  emailError.value = '';
  passwordError.value = '';
  
  if (!email.value) {
    emailError.value = 'Email is required';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    emailError.value = 'Please enter a valid email';
    isValid = false;
  }
  
  if (!password.value) {
    passwordError.value = 'Password is required';
    isValid = false;
  } else if (password.value.length < 6) {
    passwordError.value = 'Password must be at least 6 characters';
    isValid = false;
  }
  
  return isValid;
};

const handleLogin = async () => {
  if (!validateForm()) return;
  
  const result = await authStore.login({
    email: email.value,
    password: password.value
  });
  
  if (result.success) {
    showNotification.value = true;
    notificationMessage.value = 'Login successful! Redirecting...';
    notificationType.value = 'success';
    
    setTimeout(() => {
      router.push('/orders');
    }, 1500);
  } else {
    showNotification.value = true;
    notificationMessage.value = result.error;
    notificationType.value = 'error';
  }
};

const closeNotification = () => {
  showNotification.value = false;
  authStore.clearError();
};
</script>

<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-4">
        <div class="card shadow">
          <div class="card-body">
            <h3 class="text-center mb-4">Order Management System</h3>
            <h5 class="text-center text-muted mb-4">Login</h5>
            
            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label for="email" class="form-label">Email address</label>
                <input
                  v-model="email"
                  type="email"
                  class="form-control"
                  :class="{ 'is-invalid': emailError }"
                  id="email"
                  placeholder="Enter your email"
                  :disabled="authStore.isLoading"
                >
                <div v-if="emailError" class="invalid-feedback">
                  {{ emailError }}
                </div>
              </div>
              
              <div class="mb-4">
                <label for="password" class="form-label">Password</label>
                <input
                  v-model="password"
                  type="password"
                  class="form-control"
                  :class="{ 'is-invalid': passwordError }"
                  id="password"
                  placeholder="Enter your password"
                  :disabled="authStore.isLoading"
                >
                <div v-if="passwordError" class="invalid-feedback">
                  {{ passwordError }}
                </div>
              </div>
              
              <button
                type="submit"
                class="btn btn-primary w-100"
                :disabled="authStore.isLoading"
              >
                <span v-if="authStore.isLoading" class="spinner-border spinner-border-sm me-2"></span>
                {{ authStore.isLoading ? 'Logging in...' : 'Login' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <NotificationToast
    :show="showNotification"
    :message="notificationMessage"
    :type="notificationType"
    @close="closeNotification"
  />
</template>