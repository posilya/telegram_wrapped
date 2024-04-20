<template>
  <div class="warning">
    <h2>{{ message }}</h2>
  </div>
</template>

<script setup>
const props = defineProps({
  message: {
    type: String,
    default: null
  }
})

const { message } = props
</script>

<style lang="stylus">
.warning
  slide($dark-yellow)
  color #000
</style>
