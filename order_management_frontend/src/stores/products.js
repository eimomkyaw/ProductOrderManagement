import { defineStore } from 'pinia'
import axios from '../axios'

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [],
    cart: [],
    isLoading: false,
    error: null,
    orderError: null,
    orderLoading: false,
    pagination: {
      currentPage: 1,
      lastPage: 1,
      totalPages: 1,
      nextPageUrl: null,
      prevPageUrl: null
    }
  }),

  getters: {
    cartTotal: (state) => {
      return state.cart.reduce((total, item) => {
        return total + (parseFloat(item.price || 0) * item.quantity)
      }, 0)
    },

    cartItemCount: (state) => {
      return state.cart.reduce((count, item) => count + item.quantity, 0)
    },

    getProductById: (state) => {
      return (productId) => state.products.find(p => p.id === productId)
    }
  },

  actions: {
    async fetchProducts() {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await axios.get('/products')
        
        // Handle Laravel paginated response structure correctly
        // response.data.data is the paginated object, response.data.data.data is the products array
        const productsData = response.data.data?.data || response.data.data || response.data || []
        
        // Filter out empty objects but keep valid products
        this.products = Array.isArray(productsData) 
          ? productsData.filter(product => product && typeof product === 'object' && Object.keys(product).length > 0) 
          : []
        
        // Update pagination state from API response
        if (response.data.data) {
          this.pagination.currentPage = response.data.data.current_page || 1
          this.pagination.lastPage = response.data.data.last_page || 1
          this.pagination.totalPages = response.data.data.last_page || 1
          this.pagination.nextPageUrl = response.data.data.next_page_url || null
          this.pagination.prevPageUrl = response.data.data.prev_page_url || null
        }
        
        return { success: true, data: this.products }
      } catch (error) {
        console.error('Fetch Products Error:', error)
        this.error = error.response?.data?.message || 'Failed to fetch products'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    addToCart(product) {
      const existingItem = this.cart.find(item => item.product_id === product.id)
      
      if (existingItem) {
        existingItem.quantity++
      } else {
        this.cart.push({
          product_id: product.id,
          name: product.name,
          price: parseFloat(product.price || 0),
          stock: Number(product.stock || 0),
          quantity: 1
        })
      }
    },

    removeFromCart(productId) {
      this.cart = this.cart.filter(item => item.product_id !== productId)
    },

    updateQuantity(productId, quantity) {
      if (quantity <= 0) {
        this.removeFromCart(productId)
      } else {
        const item = this.cart.find(item => item.product_id === productId)
        if (item) {
          item.quantity = quantity
        }
      }
    },

    clearCart() {
      this.cart = []
    },

    async submitOrder() {
      if (this.cart.length === 0) {
        return { success: false, error: 'Cart is empty' }
      }

      this.orderLoading = true
      this.orderError = null
      this.error = null

      try {
        const payload = {
          items: this.cart.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity
          }))
        }
        const response = await axios.post('/auth/orders', payload)
        
        this.clearCart()
        return { success: true, data: response.data }
      } catch (error) {
        const data = error.response?.data
        this.error = null
        this.orderError = data?.message
          || data?.error
          || Object.values(data?.errors || {}).flat().join(' ')
          || 'Failed to submit order'
        return { success: false, error: this.orderError }
      } finally {
        this.orderLoading = false
      }
    },

    clearError() {
      this.error = null
    },

    clearOrderError() {
      this.orderError = null
    },

    async nextPage() {
      if (this.pagination.nextPageUrl && !this.isLoading) {
        return await this.fetchPage(this.pagination.nextPageUrl)
      }
    },

    async previousPage() {
      if (this.pagination.prevPageUrl && !this.isLoading) {
        return await this.fetchPage(this.pagination.prevPageUrl)
      }
    },

    async goToPage(pageNumber) {
      if (pageNumber >= 1 && pageNumber <= this.pagination.totalPages && !this.isLoading) {
        const pageUrl = `/products?page=${pageNumber}`
        return await this.fetchPage(pageUrl)
      }
    },

    async fetchPage(url) {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await axios.get(url)
        
        // Handle Laravel paginated response structure
        const productsData = response.data.data?.data || response.data.data || response.data || []
        
        // Replace products with new page data
        this.products = Array.isArray(productsData) 
          ? productsData.filter(product => product && typeof product === 'object' && Object.keys(product).length > 0) 
          : []
        
        // Update pagination state
        if (response.data.data) {
          this.pagination.currentPage = response.data.data.current_page || 1
          this.pagination.lastPage = response.data.data.last_page || 1
          this.pagination.totalPages = response.data.data.last_page || 1
          this.pagination.nextPageUrl = response.data.data.next_page_url || null
          this.pagination.prevPageUrl = response.data.data.prev_page_url || null
        }
        
        return { success: true, data: this.products }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch products'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    }
  }
})
