<template>
  <div class="first-message">
    <h2>{{ firstMessage.text }}</h2>
    <p><span v-if="year != -1">Ваш {{ year }} начался</span><span v-else>Ваша история началась</span> {{ firstMessage.date }} с этого сообщения <span v-if="firstMessage.destination[0] == 'unknown'">в чате с</span><span v-else-if="firstMessage.destination[0] == 'from'">от</span><span v-else-if="firstMessage.destination[0] == 'to'">для</span> {{ firstMessage.destination[1] }}.</p>
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
