<template>
  <div>
    <p v-if="!stat || !year">
      Что-то пошло не так…
    </p>
    <p v-else-if="stat.numberOfChats === 0">
      В {{ year }} году не было сообщений
    </p>
    <div v-else id="stat-presentation">
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
<script setup>
import { onMounted, onUpdated, ref } from 'vue'

const props = defineProps({
  stat: {
    type: Object,
    default: null
  },
  year: {
    type: Number,
    default: null
  }
})

const { stat, year } = props

/** List of slides */
const slides = ref(null)

/** Old scroll  */
let oldScroll = window.scrollY

let scrollingInProgress = false

const changeSlide = async () => {
  if (scrollingInProgress) {
    return
  }

  const currentScroll = window.scrollY
  const clientHeight = document.documentElement.clientHeight

  // if the scroll position has not changed
  if (oldScroll === currentScroll) {
    return
  }

  // if scrolled down
  if (oldScroll < currentScroll) {
    for (let index = 0; index < slides.value.length; index++) {
      const slide = slides.value[index]
      const slidePosition = slide.getBoundingClientRect().top

      if (index === 0) {
        if (slidePosition > 0 && slidePosition < clientHeight / 3) {
          scrollingInProgress = true
          await slide.scrollIntoView({ behavior: 'smooth' })
          scrollingInProgress = false
          break
        }
      }

      if (slidePosition > 0 && slidePosition < clientHeight * 0.4) {
        scrollingInProgress = true
        await slide.scrollIntoView({ behavior: 'smooth' })
        scrollingInProgress = false
        break
      }
    }
  } else { // if scrolled up
    for (let index = slides.value.length - 1; index >= 0; index--) {
      const slide = slides.value[index]
      const slidePosition = clientHeight - slide.getBoundingClientRect().bottom

      if (slidePosition > 0 && slidePosition < clientHeight * 0.6) {
        scrollingInProgress = true
        await slide.scrollIntoView({ behavior: 'smooth', block: 'end' })
        scrollingInProgress = false
        break
      }
    }
  }

  oldScroll = window.scrollY
}

onMounted(async () => {
  slides.value = document.querySelectorAll('#stat-presentation > div')

  scrollingInProgress = true
  await slides.value[0].scrollIntoView({ behavior: 'smooth' })
  scrollingInProgress = false

  oldScroll = window.scrollY

  window.addEventListener('scroll', changeSlide)
})

onUpdated(async () => {
  slides.value = document.querySelectorAll('#stat-presentation > div')

  await slides.value[0].scrollIntoView({ behavior: 'smooth' })

  oldScroll = window.scrollY
})

</script>
