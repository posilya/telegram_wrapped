<template>
  <div class="number-of-messages">
    <h2><span v-if="myMessages > 0">{{ myMessages.toLocaleString() }}</span><span v-else>{{ allMessages.toLocaleString() }}</span> {{ $declensionWordsFromNum((myMessages > 0 ? myMessages : allMessages), ['сообщение', 'сообщения', 'сообщений']) }}</h2>
    <p v-if="myMessages > 0">
      вы <span v-if="year != -1">отправили в {{ year }} году</span><span v-else>успели отправить за всё время</span>. А получили {{ (allMessages - myMessages).toLocaleString() }}, вместе это {{ allMessages.toLocaleString() }} {{ $declensionWordsFromNum(allMessages, ['сообщение', 'сообщения', 'сообщений']) }}!
    </p>
    <p v-else>
      было <span v-if="year != -1">в {{ year }} году</span><span v-else>за всё ваше время здесь</span>.
    </p>
  </div>
</template>

<script>
export default {
  name: 'StatBlockNumberOfMessages',
  props: {
    year: {
      type: Number,
      default: null
    },
    myMessages: {
      type: Number,
      default: null
    },
    allMessages: {
      type: Number,
      default: null
    }
  }
}
</script>

<style lang="stylus">
.number-of-messages
  background-color $blue
  color #fff
</style>
