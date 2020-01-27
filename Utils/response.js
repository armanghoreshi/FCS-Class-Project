'use strict';
const chalk = require('chalk');
console.log(chalk.cyan("response.js is running ... "));

exports.ok = (response, data) => {
    console.log(chalk.cyan("response.js/ok executed ... "));

    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.write(JSON.stringify(data));
    response.end();
};

exports.error = (response, data) => {
    console.log(chalk.cyan("response.js/error executed ... "));

    response.statusCode = 400;
    response.setHeader('Content-Type', 'application/json');
    response.write(JSON.stringify(data));
    response.end();
};
