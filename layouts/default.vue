<template>
  <div>
    <BrandLogo :site-name="'telegram_wrapped'" :is-beta="true" />
    <Nuxt />
    <BrandFooter />
  </div>
</template>
<script>
export default {
  name: 'DefaultLayout'
}
</script>
