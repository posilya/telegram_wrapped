<template>
  <div>
    <div class="stat-file">
      <form>
        <label for="file"><span class="file-upload-icon" />файлик</label>
        <input id="file" ref="file" type="file" hidden>
        <div class="year">
          <label for="year">итоги за</label>
          <select id="year" ref="yearSelect" name="year" />
        </div>
      </form>
    </div>
    <StatPresentation v-if="statIsShown" :key="statKey" :stat="telegramStat" :year="statYear" />
  </div>
</template>

<script setup>

import { ref, onMounted } from 'vue'

const file = ref(null)
const yearSelect = ref(null)

const statIsShown = ref(false)
const telegramStat = ref(null)
const statYear = ref(null)
const statKey = ref(0)

/**
 * Class for counting statistics
 * @param {string} name - chat name
 * @param {number} allMessages - counter of all chat messages
 * @param {number} myMessages - counter of user chat messages
 */
class ChatStatistic {
  /**
   * Array of months
   * @type {string[]}
   */
  static numToMonths = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
  /**
   * Array of prepositions and conjunctions
   * @type {string[]}
   */
  static prepositionsConjunctions = ['а', 'в', 'на', 'под', 'с', 'из', 'по', 'у', 'за', 'к', 'о', 'от', 'до', 'перед', 'при', 'через', 'без', 'для', 'после', 'во', 'не', 'и', 'или', 'но', 'то', 'если', 'когда', 'чтобы', 'потому', 'ибо', 'что', 'это']

  _name
  #allMessages
  #myMessages

  /**
   * Class for counting statistics
   * @param {string} name - chat name
   */
  constructor (name) {
    this._name = String(name)
    this.#allMessages = 0
    this.#myMessages = 0
  }

  /**
   * Stat counting function
   * @param {array} messages - array of chats and messages
   * @param {number} myId - user id
   * @param {number} year - year, for witch stat are counted
   * @returns {object}
   */
  static countStat (messages, myId, year) {
    /** Founded non-empty chats */
    let chats = []

    /** Counter of all chats */
    let numberOfChats = 0

    /** Counter of all messages for all chats */
    let allMessages = 0

    /** Counter of user messages for all chats */
    let myMessages = 0

    /** First message */
    let firstMessage

    /** User sended emoji collection */
    let emojis = new Map()

    /** The longest sent ahah */
    let longestAhah

    /** User sended words stat */
    let words = new Map()

    /** Counter day of the week */
    let dayOfWeek = new Map([
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
      [5, 0],
      [6, 0]
    ])

    for (const chat of messages) {
      // count only personal chats
      if (chat.type !== 'personal_chat') {
        continue
      }

      /** Object for counting this chat */
      const chatStat = new ChatStatistic(chat.name)

      for (const message of chat.messages) {
        // don't count forwarded messages
        if (message.forwarded_from) {
          continue
        }

        /** Date of the message */
        const messageDate = new Date(message.date_unixtime * 1000)

        if (year !== -1 && messageDate.getFullYear() !== year) {
          continue
        }

        // count only really messages
        if (message.type === 'message') {
          chatStat.incAllMessages()
          allMessages++

          // find the first message
          if (!firstMessage || messageDate.getTime() < firstMessage.date_unixtime * 1000) {
            firstMessage = message
            firstMessage.chatName = chat.name
          }

          // count day of the week
          dayOfWeek.set(messageDate.getDay(), dayOfWeek.get(messageDate.getDay()) + 1)

          // if this message is from user
          if (myId && message.from_id === `user${myId}`) {
            chatStat.incMyMessages()
            myMessages++

            // count emojis
            const messageEmojis = ChatStatistic.messageTextEntitiesToString(message).match(/(\p{Emoji}\uFE0F|\p{Emoji_Presentation})/gu)
            if (messageEmojis) {
              for (const emoji of messageEmojis) {
                if (!emojis.has(emoji)) {
                  emojis.set(emoji, 1)
                } else {
                  emojis.set(emoji, emojis.get(emoji) + 1)
                }
              }
            }

            // find the longest ahah
            const messageAhahs = ChatStatistic.messageTextEntitiesToString(message).match(/[ахквсмпезжэъ=+\-_]{2,}/gi)
            if (messageAhahs) {
              for (const ahah of messageAhahs) {
                if (/а.*[хр]|х.*[ап]/i.test(ahah) && (longestAhah == null || ahah.length > longestAhah.text.length)) {
                  longestAhah = {
                    text: ahah,
                    to: chat.name,
                    date: message.date_unixtime
                  }
                }
              }
            }

            // count words
            const messageWords = ChatStatistic.messageTextEntitiesToString(message).match(/[a-zа-я-]+/gi)
            if (messageWords) {
              for (let word of messageWords) {
                word = word.toLowerCase()

                // don't prepositions and conjunctions
                if (ChatStatistic.prepositionsConjunctions.includes(word)) {
                  continue
                }

                if (!words.has(word)) {
                  words.set(word, 1)
                } else {
                  words.set(word, words.get(word) + 1)
                }
              }
            }
          }
        }
      }

      // don't count chats without messages
      if (chatStat.allMessages !== 0) {
        chats.push(chatStat)
        numberOfChats++
      }
    }

    // chats with a lot of messages in the top 5
    chats.sort((a, b) => b.allMessages - a.allMessages)
    chats = chats.slice(0, 5)

    // sort emojis
    emojis = Array.from(emojis.entries()).sort((a, b) => b[1] - a[1])

    if (firstMessage) {
      const firstMessageDate = new Date(firstMessage.date_unixtime * 1000)

      firstMessage = {
        date: `${firstMessageDate.getDate()} ${ChatStatistic.numToMonths[firstMessageDate.getMonth()]}${year === -1 ? ' ' + firstMessageDate.getFullYear() : ''} в ${String(firstMessageDate.getHours()).padStart(2, '0')}:${String(firstMessageDate.getMinutes()).padStart(2, '0')}`,
        destination: [
          myId == null ? 'unknown' : firstMessage.from_id === `user${myId}` ? 'to' : 'from',
          firstMessage.chatName
        ],
        text: ChatStatistic.messageTextEntitiesToString(firstMessage)
      }
    }

    // edit the longest ahah date
    if (longestAhah) {
      const ahahDate = new Date(longestAhah.date * 1000)
      longestAhah.date = `${ahahDate.getDate()} ${ChatStatistic.numToMonths[ahahDate.getMonth()]}${year === -1 ? ' ' + ahahDate.getFullYear() : ''}`
    }

    // sort words
    words = Array.from(words.entries()).sort((a, b) => b[1] - a[1])

    // sort week days
    dayOfWeek = Array.from(dayOfWeek.entries()).sort((a, b) => b[1] - a[1])

    return {
      chats,
      numberOfChats,
      firstMessage,
      emojis,
      allMessages,
      myMessages,
      longestAhah,
      words,
      dayOfWeek
    }
  }

  /**
   * Convert message text entities to string
   * @param {object} message - message
   */
  static messageTextEntitiesToString (message) {
    return message.text_entities.map(entity => entity.text).join('')
  }

  /**
   * chat name
   * @returns {string}
   */
  get name () {
    return this._name
  }

  /**
   * counter of all chat messages
   * @returns {number}
   */
  get allMessages () {
    return this.#allMessages
  }

  /**
   * Incriminate the counter of all chat messages
   */
  incAllMessages () {
    this.#allMessages++
  }

  /**
   * counter of user chat messages
   * @returns {number}
   */
  get myMessages () {
    return this.#myMessages
  }

  /**
   * Incriminate the counter of user chat messages
   */
  incMyMessages () {
    this.#myMessages++
  }
}

/**
 * Show or update stat
 * @param {Object} stat - statistics
 * @param {Number} year - selected year
 */
const showStat = (stat, year) => {
  telegramStat.value = stat
  statYear.value = year
  statKey.value++
  statIsShown.value = true
}

onMounted(() => {
  const updateStat = () => {
    if (!yearSelect.value || file.value.files.length === 0) {
      return
    }

    const reader = new FileReader()

    reader.readAsText(file.value.files[0])

    reader.onload = () => {
      try {
        const results = JSON.parse(reader.result)
        const myId = typeof results.personal_information === 'undefined' ? null : results.personal_information.user_id

        if (typeof results.chats === 'undefined') {
          throw new TypeError('No chats')
        }

        const chats = results.chats.list
        const stat = ChatStatistic.countStat(chats, myId, Number(yearSelect.value.value))

        showStat(stat, Number(yearSelect.value.value))
      } catch (error) {
        if (error instanceof SyntaxError) {
          showStat(
            {
              error: {
                head: 'Вы загрузили не тот файл',
                body: 'Он должен называться result.json'
              }
            }
          )
        } else if (error instanceof TypeError) {
          showStat(
            {
              error: {
                head: 'В файле нет сообщений в личных чатах',
                body: 'В настройках экспорта должна стоять галочка «Личные чаты»'
              }
            }
          )
        } else {
          showStat(
            {
              error: {
                head: 'Что-то пошло не так :('
              }
            }
          )
        }
      }
    }

    reader.onerror = () => {
      showStat(
        {
          error: {
            head: 'При чтении фала что-то пошло не так :(',
            body: 'Можете попробовать ещё раз, вдруг получится'
          }
        }
      )
    }
  }
  file.value.addEventListener('change', updateStat)
  yearSelect.value.addEventListener('change', updateStat)

  const now = new Date()
  const defaultYear = now.getMonth() === 12 ? now.getFullYear() : now.getFullYear() - 1

  const years = []
  for (let year = now.getFullYear(); year >= 2013; year--) {
    years.push(year)
  }

  yearSelect.value.innerHTML = years.map((year) => {
    return `<option ${year === defaultYear ? 'selected' : ''} value="${year}">${year}</option>`
  }).join('')

  yearSelect.value.innerHTML = '<option selected value="-1">всё время</option>' + yearSelect.value.innerHTML
})
</script>
