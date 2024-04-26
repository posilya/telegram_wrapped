<template>
  <div class="modal-background">
    <div class="modal">
      <div class="head">
        <h3>Опасность!!! Ошибка!!!!!!!! Вы ошиблись!!!!!!!!!!!!!!!</h3>
        <div class="close" />
      </div>
      <p>А может и я. А может и мы. А может никто ¯\_(ツ)_/¯</p>
    </div>
  </div>
</template>

<script setup>

</script>

<style lang="stylus">
body
  overflow hidden

.modal-background
  z-index 100
  box-sizing border-box
  position fixed
  top 0px
  left 0px
  padding 25px
  width 100dvw
  height 100dvh
  background-color rgba(0, 0, 0, 0.8)
  backdrop-filter blur(7px)
  display flex
  justify-content center
  align-items center
  overflow-y scroll

  .modal
    padding 17px
    width 600px
    box-sizing border-box
    border-radius 17px
    background-color #ffffff
    position absolute

    .head
        display flex
        justify-content space-between
        align-items baseline

        h3
          margin 0
          font-family var(--title-font)
          font-size 26px

      .close
        min-height 20px
        min-width 20px
        background-image url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 -960 960 960' width='24'%3E%3Cpath d='m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z'/%3E%3C/svg%3E")
        background-size 100% 100%

    *
      margin 0
      margin-bottom 0.5em

    & > *:last-child
      margin-bottom 0
</style>
