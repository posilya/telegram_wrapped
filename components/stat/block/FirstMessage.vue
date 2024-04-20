<template>
  <div class="first-message">
    <h2>{{ firstMessage.text }}</h2>
    <p><span v-if="year != -1">Ваш {{ year }} начался</span><span v-else>Ваша история началась</span> {{ firstMessage.date }} с этого сообщения <span v-if="firstMessage.destination[0] == 'unknown'">в чате с <span v-if="!firstMessage.destination[1]">удалённым аккаунтом</span></span><span v-else-if="firstMessage.destination[0] == 'from'">от <span v-if="!firstMessage.destination[1]">удалённого аккаунта</span></span><span v-else-if="firstMessage.destination[0] == 'to'">для <span v-if="!firstMessage.destination[1]">удалённого аккаунта</span></span><span v-if="firstMessage.destination[1]"> {{ firstMessage.destination[1] }}</span>.</p>
  </div>
</template>

<script>
export default {
  name: 'StatBlockFirstMessage',
  props: {
    year: {
      type: Number,
      default: null
    },
    firstMessage: {
      type: Object,
      default: null
    }
  }
}
</script>

<style lang="stylus">
.first-message
  slide($green)
</style>
