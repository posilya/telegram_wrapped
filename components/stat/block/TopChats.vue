<template>
  <div class="top-chats">
    <h2><span v-if="year == -1">За всё время</span><span v-else>В {{ year }} году</span> вы общались с {{ numberOfChats }} {{ $declensionWordsFromNum(numberOfChats, ['человеком', 'людьми', 'людьми']) }}. Вот те, с кем вы переписывались чаще всего:</h2>
    <div class="top-contacts">
      <div v-for="(chat, index) in chats" :key="index" class="line">
        <div class="rank">
          {{ index + 1 }}
        </div>
        <p v-if="!chat.name">
          Удалённый аккаунт
        </p>
        <p v-else>
          {{ chat.name }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatBlockTopChats',
  props: {
    year: {
      type: Number,
      default: null
    },
    numberOfChats: {
      type: Number,
      default: null
    },
    chats: {
      type: Array,
      default: null
    }
  }
}
</script>
