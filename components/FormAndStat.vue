<template>
  <input id="file" type="file">
</template>

<script>
export default {
  name: 'FormAndStat',
  mounted () {
    class ChatStatistic {
      #name
      #allMessages
      #myMessages

      constructor (name) {
        this.name = name
        this.#allMessages = 0
        this.#myMessages = 0
      }

      static countStat (messages, myId, year) {
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

          chats.push(chatStat)
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

        console.log('myId', myId)
        console.log('messages', messages)

        console.log('stat', ChatStatistic.countStat(messages, myId, 2023))
      }
      reader.onerror = () => {
        console.log(reader.error)
      }
    })
  }
}
</script>
