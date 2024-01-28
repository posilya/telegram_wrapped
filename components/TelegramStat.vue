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
      <div class="first-message">
        <h2>Первое сообщение<span v-if="year != -1"> в {{ year }} году</span> было <span v-if="stat.firstMessage.destination[0] == 'unknown'">в чате с</span><span v-else-if="stat.firstMessage.destination[0] == 'from'">от</span> <span v-else-if="stat.firstMessage.destination[0] == 'to'">для</span> {{ stat.firstMessage.destination[1] }} {{ stat.firstMessage.date }}</h2>
        <p>{{ stat.firstMessage.text }}</p>
      </div>
      <div class="number-of-messages">
        <h2><span v-if="stat.myMessages > 0">{{ stat.myMessages.toLocaleString() }}</span><span v-else>{{ stat.allMessages.toLocaleString() }}</span> {{ declensionWordsFromNum((stat.myMessages > 0 ? stat.myMessages : stat.allMessages), ['сообщение', 'сообщения', 'сообщений']) }}</h2>
        <p v-if="stat.myMessages > 0">
          вы <span v-if="year != -1">отправили в {{ year }} году</span><span v-else>успели отправить за всё время</span>. А получили {{ (stat.allMessages - stat.myMessages).toLocaleString() }}, вместе это {{ stat.allMessages.toLocaleString() }} {{ declensionWordsFromNum(stat.allMessages, ['сообщение', 'сообщения', 'сообщений']) }}!
        </p>
        <p v-else>
          было <span v-if="year != -1">в {{ year }} году</span><span v-else>за всё ваше время здесь</span>.
        </p>
      </div>
      <div v-if="stat.emojis.length > 0" class="most-popular-emoji">
        <h2>{{ stat.emojis[0][0] }}</h2>
        <p>Этот эмодзи вы чаще всего отправляли<span v-if="year != -1"> в {{ year }} году. Наверное, им можно описать весь ваш год</span>.</p>
      </div>
      <div class="day-of-week">
        <h2 v-if="stat.dayOfWeek[0][0] == 5">
          Пятница-развратница
        </h2>
        <h2 v-else-if="stat.dayOfWeek[0][0] > 0 && stat.dayOfWeek[0][0] < 5">
          #трудовыебудни
        </h2>
        <h2 v-else>
          Активные выходные
        </h2>
        <p>Именно в {{ daysOfWeeks[stat.dayOfWeek[0][0]] }} у вас было больше всего сообщений<span v-if="year != -1"> в {{ year }} году</span>. Целых {{ stat.dayOfWeek[0][1].toLocaleString() }}!</p>
      </div>
      <div v-if="stat.longestAhah" class="longest-ahah">
        <h2>{{ stat.longestAhah.text }}</h2>
        <p>Это самое длинное ахах, что вы написали<span v-if="year != -1"> в {{ year }} году</span>. Только вдуматься, целых {{ stat.longestAhah.text.length.toLocaleString() }} {{ declensionWordsFromNum(stat.longestAhah.text.length, ['символ', 'символа', 'символов'])}}!</p>
        <p>Вы посмеялись в чате с {{ stat.longestAhah.to }} {{ stat.longestAhah.date }}.</p>
      </div>
      <div v-if="stat.words.length > 0" class="most-used-word">
        <h2>{{ stat.words.slice(0, 5).map(place => place[0]).join(' ') }}</h2>
        <p>Это предложение из ваших самых частых слов<span v-if="year != -1"> в {{ year }} году</span>.</p>
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
  data () {
    return {
      daysOfWeeks: ['воскресенье', 'понедельник', 'вторник', 'среду', 'четверг', 'пятницу', 'субботу']
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
