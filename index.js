const chalk = require('chalk')
console.log(chalk.cyan("index.js is running ... "))
const http = require('http')
const router = require('./Router/router').router
const server = http.createServer()

server.on('request', function (request, response) {
    router.lookup(request, response)
})

server.listen(3000, function () {
    console.log(`server is running on port 3000`)
})
