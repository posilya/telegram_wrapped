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
    class ChatStatistic {
      #name
      #allMessages
      #myMessages

      constructor (name) {
        this.#name = name
        this.#allMessages = 0
        this.#myMessages = 0
      }

      static countStat (messages, myId, year) {
        year = Number(year)
        const chats = []
        let allMessages = 0
        let myMessages = 0

        for (const chat of messages) {
          if (chat.type !== 'personal_chat') {
            continue
          }

          const chatStat = new ChatStatistic(chat.name)

          for (const message of chat.messages) {
            const messageDate = new Date(message.date)

            if (messageDate.getFullYear() !== year) {
              continue
            }

            if (message.type === 'message') {
              chatStat.incAllMessages()
              allMessages++
            }
            if (message.from_id === `user${myId}`) {
              chatStat.incMyMessages()
              myMessages++
            }
          }

          if (chatStat.allMessages !== 0) {
            chats.push(chatStat)
          }
        }

        chats.sort((a, b) => b.allMessages - a.allMessages)

        return {
          chats,
          allMessages,
          myMessages
        }
      }

      get name () {
        return this.#name
      }

      set name (name) {
        this.#name = String(name)
      }

      get allMessages () {
        return this.#allMessages
      }

      incAllMessages () {
        this.#allMessages++
      }

      get myMessages () {
        return this.#myMessages
      }

      incMyMessages () {
        this.#myMessages++
      }
    }

    const now = new Date()
    const defaultYear = now.getMonth() === 1 ? now.getFullYear() : now.getFullYear() - 1

    const years = []
    for (let year = now.getFullYear(); year >= 2013; year--) {
      years.push(year)
    }

    document.getElementById('year').innerHTML = years.map((year) => {
      return `<option ${year === defaultYear ? 'selected' : ''} value="${year}">${year}</option>`
    }).join('')

    document.getElementById('file').addEventListener('change', (event) => {
      const file = event.target.files[0]
      const reader = new FileReader()

      reader.readAsText(file)

      reader.onload = () => {
        const results = JSON.parse(reader.result)

        const myId = typeof results.personal_information === 'undefined' ? null : results.personal_information.user_id

        if (typeof results.chats === 'undefined') {
          throw new TypeError('No chats')
        }

        const messages = results.chats.list

        const stat = ChatStatistic.countStat(messages, myId, document.getElementById('year').value)

        console.log(stat)
        this.showStat(stat, document.getElementById('year').value)

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
    })
  },
  methods: {
    showStat (stat, year) {
      this.telegramStat = stat
      this.statYear = year
      this.statIsShown = true
    }
  }
}
</script>
