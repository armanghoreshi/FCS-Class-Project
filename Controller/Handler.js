const getRawBody = require('raw-body')
const { ok, error } = require('../Utils/response')
const { checkip } = require('../Utils/utils.js')

const url = require('url')
const querystring = require('querystring')
const https = require('https')
const fs = require('fs');
const portscanner = require('portscanner')

// =========== Global Vars ===========
let IranFlag = false
let LimitAccess = false
// =========== Q1 =============
exports.openSSH = (req, res) => {
  console.log('Open SSH Started ...')
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  ok(res, { message: 'SSH Opened' })
}
// =========== Q2 ============
exports.portScan = async (req, res) => {
  await checkip(req).then( result => {
    IranFlag = result
  })
  if (!LimitAccess || (LimitAccess && IranFlag)) {

    let port_22, port_25, port_80, port_443
    const remoteAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    const ip = remoteAddr.substr(7)

    portscanner.checkPortStatus(22, ip,  (error, status) => {
      // Status is 'open' if currently in use or 'closed' if available
      port_22 = status
      console.log(status)

      portscanner.checkPortStatus(25, ip,  (error, status) => {
        // Status is 'open' if currently in use or 'closed' if available
        port_25 = status
        console.log(status)

        portscanner.checkPortStatus(80, ip,  (error, status) => {
          // Status is 'open' if currently in use or 'closed' if available
          port_80 = status
          console.log(status)

          portscanner.checkPortStatus(443, ip,  (error, status) => {
            // Status is 'open' if currently in use or 'closed' if available
            port_443 = status
            console.log(status)

            ok(res, { ports: {
              p22: port_22,
              p25: port_25,
              p80: port_80,
              p443: port_443
            }})
          })
        })
      })
    })

  } else {
    IranFlag = false
    error(res, {message:"Access Denied !"})
  }
}
// ============ Q3 ===========
exports.log = async (req, res) => {
  await checkip(req).then( result => {
    IranFlag = result
    console.log("Iran Flag "+IranFlag)
  })
  if (!LimitAccess || (LimitAccess && IranFlag)) {
    console.log('Log Started ...')

    const remoteAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    const ip = remoteAddr.substr(7)
    const agent = req.headers['user-agent']
    const date = new Date(Date.now())
    const log = ip.concat(' | ', agent, ' | ', date.toString(), "\r\n")

    fs.appendFile('Files/logs.txt', log, function (err) {
      if (err) {
        error(res, {message: "failed to log"})
      } else {
        ok(res, {message: "logged"})
      }
    })
    IranFlag = false
  } else {
    IranFlag = false
    error(res, {message:"Access Denied !"})
  }
}
// ============== Q4 ================
exports.checkAv = async (req, res) => {
  await checkip(req).then( result => {
    IranFlag = result
  })
  if (!LimitAccess || (LimitAccess && IranFlag)) {
    console.log('Check Availability Started ...')
    getRawBody(req)
      .then((bodyBuffer) => {
        const urlInput = JSON.parse(bodyBuffer.toString())
        console.log(urlInput.url)

        const options = {
          timeout: 100,
        }

        const request = https.get(urlInput.url, options, (resp) => {
          let data = ''

          // A chunk of data has been recieved.
          resp.on('data', (chunk) => {
            data += chunk
          })

          // The whole response has been received. Print out the result.
          resp.on('end', () => {
            console.log(resp.statusCode)
            if (resp.statusCode == '200') {
              ok(res, {message: "Available"})
            } else if (res.statusCode == '404') {
              console.log('Not Found')
            } else error(res, {message: "Not Available"})
          })

        }).on("error", (err) => {
          console.log("Error: " + err.message)
        })
        request.setTimeout(1000, function () {
          error(res, {message: "filter"})
        });

      })
  }
}
// =========== Q5 =============
exports.iranaccess = (req, res) => {
  LimitAccess = true
  ok(res, {message:"access limited"})
}


// ========================================= END =========================================
