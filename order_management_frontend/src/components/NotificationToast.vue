<template>
  <div
    v-if="show"
    class="position-fixed top-0 end-0 p-3"
    style="z-index: 11"
  >
    <div
      class="toast show"
      :class="{
        'bg-success': type === 'success',
        'bg-danger': type === 'error',
        'bg-warning': type === 'warning',
        'bg-info': type === 'info'
      }"
      role="alert"
    >
      <div class="toast-header text-white" :class="headerClass">
        <strong class="me-auto">{{ title }}</strong>
        <button
          type="button"
          class="btn-close btn-close-white"
          @click="close"
        ></button>
      </div>
      <div class="toast-body text-white">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  duration: {
    type: Number,
    default: 3000
  },
  title: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close'])

const headerClass = computed(() => {
  return {
    'bg-success': props.type === 'success',
    'bg-danger': props.type === 'error',
    'bg-warning': props.type === 'warning',
    'bg-info': props.type === 'info'
  }
})

let timeoutId = null

const close = () => {
  emit('close')
}

watch(() => props.show, (newShow) => {
  if (newShow && props.duration > 0) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      close()
    }, props.duration)
  }
})
</script>
