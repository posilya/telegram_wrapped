<template>
  <div>
    <p v-if="!stat || !year">
      Что-то пошло не так…
    </p>
    <p v-else-if="stat.chats.length === 0">
      За {{ year }} год не было сообщений
    </p>
    <div v-else>
      <h2>Ваш топ контактов в {{ year }}</h2>
      <div class="top-contacts">
        <div v-for="(chat, index) in stat.chats" :key="index" class="line">
          <div class="rank">
            {{ index + 1 }}
          </div>
          <p v-if="!chat.name">Удалённый аккаунт</p>
          <p v-else>{{ chat.name }}</p>
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
  }
}
</script>
