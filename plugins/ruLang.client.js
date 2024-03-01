import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('declensionWordsFromNum', (number, words) => {
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
  })
})
