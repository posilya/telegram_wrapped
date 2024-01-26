<template>
  <div>
    <p v-if="!stat || !year">
      Что-то пошло не так…
    </p>
    <p v-else-if="stat.numberOfChats === 0">
      В {{ year }} году не было сообщений
    </p>
    <div v-else>
      <div class="top-chats">
        <h2><span v-if="year == -1">За всё время</span><span v-else>В {{ year }} году</span> вы общались с {{ stat.numberOfChats }} {{ declensionWordsFromNum(stat.numberOfChats, ['человеком', 'людьми', 'людьми'])}}. Вот те, с кем вы переписывались чаще всего:</h2>
        <div class="top-contacts">
          <div v-for="(chat, index) in stat.chats" :key="index" class="line">
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
    </div>
  </div>
</template>

<script>
export default {
  name: 'TelegramStat',
  props: {
    stat: {
      type: Object,
      default: null
    },
    year: {
      type: Number,
      default: null
    }
  },
  methods: {
    declensionWordsFromNum (number, words) {
      number = Math.abs(number) % 100
      const n = number % 10
      if (number > 10 && number < 20) {
        return words[2]
      }
      if (n > 1 && n < 5) {
        return words[1]
      }
      if (n === 1) {
        return words[0]
      }
      return words[2]
    }
  }
}
</script>
