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
