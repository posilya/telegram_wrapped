<template>
<h1>telegram_wrapped</h1>

<input type="file" @change="updateStat" name="exports-file" id="exports-file">
</template>

<script setup>
async function updateStat(event) {
  const fileInput = event.target;

  if (!fileInput.files || fileInput.files.length === 0) {
    return;
  }

  const file = await readFile(fileInput.files[0]);

  console.log('my id:', file.personal_information.user_id);
}

async function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = () => {
      try {
        return resolve(JSON.parse(reader.result));
      } catch (err) {
        console.error(err);
        return reject(new Error('Файл не JSON'));
      }
    };

    reader.onerror = (err) => {
      return reject(err);
    }
  });
}
</script>

<style scoped>

</style>
