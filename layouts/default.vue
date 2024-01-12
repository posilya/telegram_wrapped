<template>
  <div>
    <SiteLogo :site-name="'telegram_wrapped'" :is-beta="true" />
    <Nuxt />
  </div>
</template>
<script>
export default {
  name: 'DefaultLayout'
}
</script>
