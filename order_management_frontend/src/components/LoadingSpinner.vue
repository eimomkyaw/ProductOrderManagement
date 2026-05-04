<template>
  <div class="d-flex justify-content-center align-items-center" :style="containerStyle">
    <div class="spinner-border text-primary" :style="spinnerStyle" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <span v-if="text" class="ms-2">{{ text }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  text: {
    type: String,
    default: ''
  },
  centered: {
    type: Boolean,
    default: true
  },
  height: {
    type: String,
    default: '200px'
  }
})

const containerStyle = computed(() => {
  if (props.centered) {
    return {
      height: props.height,
      minHeight: props.height
    }
  }
  return {}
})

const spinnerStyle = computed(() => {
  const sizes = {
    sm: 'width: 1rem; height: 1rem;',
    md: 'width: 2rem; height: 2rem;',
    lg: 'width: 3rem; height: 3rem;'
  }
  return sizes[props.size] || sizes.md
})
</script>
