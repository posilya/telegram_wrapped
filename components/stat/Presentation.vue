<template>
  <div>
    <div v-if="!stat || !year" id="stat-presentation">
      <StatError />
    </div>
    <div v-else-if="stat.numberOfChats === 0">
      <div v-if="year !== -1" id="stat-presentation">
        <StatWarning :message="`В ${year} году не было сообщений.`" />
      </div>
      <div v-else id="stat-presentation">
        <StatWarning :message="'У вас ещё не было сообщений. Но всё впереди!'" />
      </div>
    </div>
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

const device = useDevice()

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

/** Is this Firefox or Safari */
let isNormalBrowser = false

/** List of slides */
const slides = ref(null)

/** Old scroll  */
let oldScroll = window.scrollY

/**
 * Scroll to block
 * @param {HTMLElement} element - DOM element to scroll to
 * @param {object} params - scroll options
 */
const scrollToBlock = (element, params = { }) => {
  if (isNormalBrowser && !params.behavior) {
    params.behavior = 'smooth'
  }

  element.scrollIntoView(params)
}

/**
 * Search for the slide to go to and scroll to it
 */
const changeSlide = () => {
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
          scrollToBlock(slide)
          break
        }
      }

      if (slidePosition > 0 && slidePosition < clientHeight * 0.4) {
        scrollToBlock(slide)
        break
      }
    }
  } else { // if scrolled up
    for (let index = slides.value.length - 1; index >= 0; index--) {
      const slide = slides.value[index]
      const slidePosition = clientHeight - slide.getBoundingClientRect().bottom

      if (slidePosition > 0 && slidePosition < clientHeight * 0.6) {
        scrollToBlock(slide, { block: 'end' })
        break
      }
    }
  }

  oldScroll = window.scrollY
}

onMounted(() => {
  slides.value = document.querySelectorAll('#stat-presentation > div')

  isNormalBrowser = (device.isFirefox || device.isSafari)

  scrollToBlock(slides.value[0])

  oldScroll = window.scrollY

  window.addEventListener('scrollend', changeSlide)
})

onUpdated(() => {
  slides.value = document.querySelectorAll('#stat-presentation > div')

  scrollToBlock(slides.value[0])
})

</script>

<style lang="stylus">
#stat-presentation > div
  padding $slide-indent
  box-sizing border-box

  & > *:first-child
    margin-top 0px

  & > *:last-child
    margin-bottom 0px
</style>
