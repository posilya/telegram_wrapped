<template>
  <div>
    <NotPCWarning />
    <div class="fullscreen-head">
      <h1>Ваши итоги года в&nbsp;<span class="highlighted">Telegram</span></h1>
    </div>
    <main>
      <h2>Что нужно сделать</h2>
      <ul>
        <li>В <a href="https://desktop.telegram.org/">Telegram Desktop</a> (для macOS не подойдёт) в настройках, пункте <b>Продвинутые настройки</b> нажмите <b>Экспорт данных</b></li>
        <li>В открывшемся меню поставьте галочки у пунктов <b>Информация об аккаунте</b> и <b>Личные чаты</b>. Остальные галочки лучше убрать, чтобы всё прошло быстрее</li>
        <li>В самом низу выберите <b>Машиночитаемый JSON</b> и нажмите <b>Экспортировать</b></li>
        <li>Получившийся файлик загрузите в форму ниже 👇</li>
      </ul>
    </main>
    <FormAndStat />
  </div>
</template>

<script>
export default {
  layout: 'DefaultLayout'
}
</script>

<style lang="stylus">
.fullscreen-head
  margin-bottom 2em

  h1
    line-height 1

main
  h2
    margin-top 0

  ul
    padding-left 1em
    margin-top 0

  > *
    margin-bottom 0.5em
</style>
