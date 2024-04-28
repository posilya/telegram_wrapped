<template>
  <div class="error">
    <h2>{{ message.head }}</h2>
    <p v-if="message.body">
      {{ message.body }}
    </p>
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
