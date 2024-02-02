<template>
  <div v-if="emojis.length > 0" class="most-popular-emoji">
    <h2>{{ emojis[0][0] }}</h2>
    <p>Этот эмодзи вы чаще всего отправляли<span v-if="year != -1"> в {{ year }} году. Наверное, им можно описать весь ваш год</span>.</p>
  </div>
</template>

<script>
export default {
  name: 'StatBlockMostPopularEmoji',
  props: {
    year: {
      type: Number,
      default: null
    },
    emojis: {
      type: Array,
      default: null
    }
  }
}
</script>
