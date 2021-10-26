const colors = require('colors')
const portfinder = require('portfinder')

const exec = require('child_process').exec

colors.setTheme({
  note: 'blue',
  error: 'red',
  success: 'green',
  warn: 'yellow',
})

const start = async () => {
  try {
    portfinder.basePort = 80

    const serverPort = await portfinder.getPortPromise()

    var devProcess = exec(
      `${__dirname.replace(/\\/g, '/')}/node_modules/.bin/webpack-dev-server --config ${__dirname.replace(
        /\\/g,
        '/'
      )}/webpack.config.js --hot --host 0.0.0.0 --port ${serverPort}`
    )
    devProcess.stdout.pipe(process.stdout)
  } catch (e) {
    console.log(e.message.error)
  }
}

start()

return
