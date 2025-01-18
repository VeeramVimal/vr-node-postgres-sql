const fs = require('fs');

const utils = {};

fs.readdirSync(__dirname).forEach((file) => {
  if (file !== 'index.js' && file.split('.')[1] === 'js') {
    const name = file.substr(0, file.indexOf('.'));
    utils[name] = require(`./${name}`); // eslint-disable-line global-require, import/no-dynamic-require
  }
});

module.exports = utils;