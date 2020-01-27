const url = require('url')
const querystring = require('querystring')
const https = require('https')
const fs = require('fs');

exports.checkip = async (req) => {
  return new Promise(function (resolve,reject) {
    let return_val
    const remoteAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    //const ip = remoteAddr.substr(7)
    const ip = '95.38.123.139'

      https.get('https://api.ipgeolocation.io/ipgeo?apiKey=621e5379544f4648ae914b5a08aba858&ip=' + ip, (resp) => {
      let data = ''

      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk
      })

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        const jsonObj = JSON.parse(data)
        if (jsonObj.country_code2 =='IR')  {
          console.log('true')
          resolve(true)
        }
        resolve(false)
      })
    })
  })

}
