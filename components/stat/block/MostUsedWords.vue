<template>
  <div v-if="words.length > 0" class="most-used-words">
    <h2>{{ words.slice(0, 5).map(place => place[0]).join(' ') }}</h2>
    <p>Это предложение из ваших самых частых слов<span v-if="year != -1"> в {{ year }} году</span>.</p>
  </div>
</template>

<script>
export default {
  name: 'StatBlockMostUsedWords',
  props: {
    year: {
      type: Number,
      default: null
    },
    words: {
      type: Array,
      default: null
    }
  }
}
</script>

<style lang="stylus">
.most-used-words
  background-color $blue
  color #fff

  h2
    display inline-block
    background-color #fff
    color #000
    padding 11px 14px 6px 14px
    border-radius 13px
    box-shadow 0px 9px 16px #00337a
</style>
