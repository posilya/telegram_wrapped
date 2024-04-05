<template>
  <div class="day-of-week" :class="{ friday: dayOfWeek[0][0] == 5, 'working-days': dayOfWeek[0][0] > 0 && dayOfWeek[0][0] < 5, weekends: dayOfWeek[0][0] > 5 && dayOfWeek[0][0] < 7 }">
    <h2 v-if="dayOfWeek[0][0] == 5">
      Пятница-развратница
    </h2>
    <h2 v-else-if="dayOfWeek[0][0] > 0 && dayOfWeek[0][0] < 5">
      #трудовыебудни
    </h2>
    <h2 v-else>
      Активные выходные
    </h2>
    <p>Именно в {{ daysOfWeeks[dayOfWeek[0][0]] }} у вас было больше всего сообщений<span v-if="year != -1"> в {{ year }} году</span>. Целых {{ dayOfWeek[0][1].toLocaleString() }}!</p>
  </div>
</template>

<script>
export default {
  name: 'StatBlockDayOfWeek',
  props: {
    year: {
      type: Number,
      default: null
    },
    dayOfWeek: {
      type: Array,
      default: null
    }
  },
  data () {
    return {
      daysOfWeeks: ['воскресенье', 'понедельник', 'вторник', 'среду', 'четверг', 'пятницу', 'субботу']
    }
  }
}
</script>

<style lang="stylus">
.day-of-week
  color #fff

  &.friday
    background-color $red
  &.working-days
    background-color $gray
  &.weekends
    background-color $violet
</style>
