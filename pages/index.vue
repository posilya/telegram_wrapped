<template>
  <input id="file" type="file">
</template>

<script>
export default {
  name: 'IndexPage',
  mounted () {
    document.getElementById('file').addEventListener('change', (event) => {
      const file = event.target.files[0]
      const reader = new FileReader()

      reader.readAsText(file)

      reader.onload = () => {
        console.log(JSON.parse(reader.result).chats.list)
      }
      reader.onerror = () => {
        console.log(reader.error)
      }
    })
  }
}
</script>
