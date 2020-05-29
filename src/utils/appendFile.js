const fs = require('fs');

const appendFile = (file, data) =>
  new Promise((resolve, reject) => {
    try {
      if (file) {
        fs.appendFile(file, data, (err) => {
          if (err) {
            console.log("writeFile error: ", err);
            resolve({ error: true })

          }
          resolve({ error: false })
        });
      }
    } catch (error) {
      console.log("writeToFile error", error);
      resolve({ error: true })
    }
  })


module.exports = appendFile;