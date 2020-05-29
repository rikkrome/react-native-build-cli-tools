const fs = require('fs');

const readFile = (fileName) => {
  return new Promise((resolve, reject) => {
    if (!fileName) {
      return null
    }
    fs.readFile(fileName, { encoding: 'utf-8' }, function (err, data) {
      if (!err) {
        resolve(data)
      } else {
        console.log(err);
        resolve(err)
      }
    });
  })
}

module.exports = readFile;