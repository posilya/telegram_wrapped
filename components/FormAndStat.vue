<template>
  <div>
    <div>
      <form>
        <label for="file"><span class="file-upload-icon" />файлик</label>
        <input id="file" type="file" hidden>
        <div class="year">
          <label for="year">итоги за</label>
          <select id="year" name="year" />
        </div>
      </form>
    </div>
    <TelegramStat v-if="statIsShown" :stat="telegramStat" :year="statYear" />
  </div>
</template>

<script>
export default {
  name: 'FormAndStat',
  data () {
    return {
      statIsShown: false,
      telegramStat: null,
      statYear: null
    }
  },
  mounted () {
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

      #name
      #allMessages
      #myMessages

      /**
       * Class for counting statistics
       * @param {string} name - chat name
       */
      constructor (name) {
        this.name = name
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
        let firstMessage = { date_unixtime: Number.MAX_SAFE_INTEGER }

        /** User sended emoji collection */
        let emojis = new Map()

        /** The longest sent ahah */
        let longestAhah = null

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
              if (messageDate.getTime() < firstMessage.date_unixtime * 1000) {
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
                const messageAhahs = ChatStatistic.messageTextEntitiesToString(message).match(/[ахквсмпезжэъ=+\-_]+/gi)
                if (messageAhahs) {
                  for (const ahah of messageAhahs) {
                    if (longestAhah == null || ahah.length > longestAhah.text.length) {
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
                    // don't count short words
                    if (word.length < 3) {
                      continue
                    }
                    word = word.toLowerCase()
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

        const firstMessageDate = new Date(firstMessage.date_unixtime * 1000)
        firstMessage = {
          date: `${firstMessageDate.getDate()} ${ChatStatistic.numToMonths[firstMessageDate.getMonth()]}${year === -1 ? ' ' + firstMessageDate.getFullYear() : ''} в ${String(firstMessageDate.getHours()).padStart(2, '0')}:${String(firstMessageDate.getMinutes()).padStart(2, '0')}`,
          destination: [
            myId == null ? 'unknown' : firstMessage.from_id === `user${myId}` ? 'to' : 'from',
            firstMessage.chatName
          ],
          text: ChatStatistic.messageTextEntitiesToString(firstMessage)
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
        return this.#name
      }

      /**
       * chat name
       * @param {string} name - chat name
       */
      set name (name) {
        this.#name = String(name)
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

    /** DOM-element year (<select>) */
    const yearSelect = document.getElementById('year')

    /** DOM-element file-upload (<input type="file">) */
    const file = document.getElementById('file')

    // IDK why everything stopped working without it
    const showStat = this.showStat

    /**
     * Function for count and show statistics
     */
    function updateStat () {
      if (!yearSelect.value || file.files.length === 0) {
        return
      }

      const reader = new FileReader()

      reader.readAsText(file.files[0])

      reader.onload = () => {
        /** Telegram data */
        const results = JSON.parse(reader.result)

        /** User id */
        const myId = typeof results.personal_information === 'undefined' ? null : results.personal_information.user_id // TODO transfer a constant to the method of the statistics class

        // if there are no chats, then there is nothing to count
        if (typeof results.chats === 'undefined') {
          throw new TypeError('No chats')
        }

        /** User chats */
        const chats = results.chats.list

        /** User statistics */
        const stat = ChatStatistic.countStat(chats, myId, Number(yearSelect.value))

        console.log(stat)
        showStat(stat, yearSelect.value)

        // const statBlock = document.getElementById('stat')

        // statBlock.innerHTML = `<p>Все сообщения: ${stat.allMessages}</p>`
        // if (myId !== null) {
        //   statBlock.innerHTML += `<p>Ваши сообщения: ${stat.myMessages}</p>`
        //   statBlock.innerHTML += `<p>Полученные сообщения: ${stat.allMessages - stat.myMessages}</p>`
        // }
      }
      reader.onerror = () => {
        console.log(reader.error)
      }
    }

    file.addEventListener('change', updateStat)
    yearSelect.addEventListener('change', updateStat)

    // We fill in the years that you can choose
    const now = new Date()
    const defaultYear = now.getMonth() === 1 ? now.getFullYear() : now.getFullYear() - 1

    const years = []
    for (let year = now.getFullYear(); year >= 2013; year--) {
      years.push(year)
    }

    yearSelect.innerHTML = years.map((year) => {
      return `<option ${year === defaultYear ? 'selected' : ''} value="${year}">${year}</option>`
    }).join('')

    yearSelect.innerHTML = '<option selected value="-1">всё время</option>' + yearSelect.innerHTML
  },
  methods: {
    showStat (stat, year) {
      this.telegramStat = stat
      this.statYear = Number(year)
      this.statIsShown = true
    }
  }
}
</script>
