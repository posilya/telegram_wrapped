<template>
  <div class="logo">
    <span>pos_ilya.dev/</span>
    <span class="site-name">{{ siteName }}<span v-if="isBeta" class="beta" /></span>
  </div>
</template>

<script>
export default {
  name: 'BrandLogo',
  props: {
    siteName: {
      type: String,
      default: ''
    },
    isBeta: Boolean
  }
}
</script>
