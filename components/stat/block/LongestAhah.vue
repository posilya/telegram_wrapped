<template>
  <div v-if="longestAhah" class="longest-ahah">
    <h2>{{ longestAhah.text }}</h2>
    <p>Это самое длинное ахах, что вы написали<span v-if="year != -1"> в {{ year }} году</span>. Только вдуматься, целых {{ longestAhah.text.length.toLocaleString() }} {{ $declensionWordsFromNum(longestAhah.text.length, ['символ', 'символа', 'символов'])}}!</p>
    <p>Вы посмеялись в чате с {{ longestAhah.to }} {{ longestAhah.date }}.</p>
  </div>
</template>

<script>
export default {
  name: 'StatBlockLongestAhah',
  props: {
    year: {
      type: Number,
      default: null
    },
    longestAhah: {
      type: Object,
      default: null
    }
  }
}
</script>
