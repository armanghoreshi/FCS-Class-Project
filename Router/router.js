const chalk = require('chalk')
console.log(chalk.cyan('router.js is running ... '))

// imports
var finalhandler = require('finalhandler')
const serveStatic = require('serve-static')

const serve = serveStatic('public/', { index: ['index.html', 'index.htm'] })

// ----core imports
const url = require('url')

// ----local imports
const { openSSH, checkAv, log, iranaccess, portScan} = require('../Controller/Handler')


// ----find-my-way module router
const router = require('find-my-way')({
  defaultRoute: (request, response) => {
    // serve static files
    serve(request, response, finalhandler(request, response))
  }
})

// -------------------- Q1-SSH -------------------------
router.get('/allowme', openSSH)
router.post('/checkAvailability', checkAv)
router.get('/log', log)
router.get('/IRANAccess', iranaccess)
router.get('/checkme', portScan)


module.exports = { router }
