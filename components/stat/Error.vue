<template>
  <div class="error">
    <h2>{{ message }}</h2>
  </div>
</template>

<script setup>
const props = defineProps({
  message: {
    type: String,
    default: 'Что-то пошло не так…'
  }
})

const { message } = props
</script>

<style lang="stylus">
.error
  slide($dark-red)
  color #fff
</style>
