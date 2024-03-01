<template>
  <div>
    <BrandLogo :site-name="'telegram_wrapped'" :is-beta="true" />
    <slot />
    <BrandFooter />
  </div>
</template>

<script>
export default {
  name: 'DefaultLayout'
}
</script>
