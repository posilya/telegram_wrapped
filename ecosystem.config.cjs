module.exports = {
  apps: [
    {
      name: 'telegram_wrapped',
      port: '3000',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs'
    }
  ]
}
