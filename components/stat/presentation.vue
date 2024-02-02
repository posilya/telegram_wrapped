<template>
  <div>
    <p v-if="!stat || !year">
      Что-то пошло не так…
    </p>
    <p v-else-if="stat.numberOfChats === 0">
      В {{ year }} году не было сообщений
    </p>
    <div v-else>
      <StatBlockTopChats :year="year" :number-of-chats="stat.numberOfChats" :chats="stat.chats" />
      <StatBlockFirstMessage :year="year" :first-message="stat.firstMessage" />
      <StatBlockNumberOfMessages :year="year" :my-messages="stat.myMessages" :all-messages="stat.allMessages" />
      <StatBlockMostPopularEmoji :year="year" :emojis="stat.emojis" />
      <StatBlockDayOfWeek :year="year" :day-of-week="stat.dayOfWeek" />
      <StatBlockLongestAhah :year="year" :longest-ahah="stat.longestAhah" />
      <StatBlockMostUsedWords :year="year" :words="stat.words" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatPresentation',
  props: {
    stat: {
      type: Object,
      default: null
    },
    year: {
      type: Number,
      default: null
    }
  }
}
</script>
