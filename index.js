const path = require('path')
const fs = require('fs')

const config = {
  entry: process.argv[2] ? path.resolve(__dirname, process.argv[2]) : path.resolve(__dirname, "sourceFolder"),
  dest: process.argv[3] ? path.resolve(__dirname, process.argv[3]) : path.resolve(__dirname, "destFolder"),
}

function reader(src) {
  fs.readdir(src, function (err, files) {
    if (err) throw err

    files.forEach(function (file, ind, array) {
      const currentPath = path.resolve(src, file)
      fs.stat(currentPath, function (err, stats) {
        if (err) throw err

        if (stats.isDirectory()) {
            reader(currentPath)
        } else {
          console.log('file', currentPath)
          const pathDestDir = path.resolve(config.dest, path.basename(currentPath)[0].toUpperCase())
          console.log('destFolder', pathDestDir);
          fs.stat(pathDestDir, function (err) {
            if (!err) {
              newPath = path.resolve(pathDestDir, path.basename(currentPath))
              fs.link(currentPath, newPath, function (err) {
                if (err) {
                  throw err;
                }

              });
            }
            else if (err.code === 'ENOENT') {
              fs.mkdir(pathDestDir, err => {
                if (err) throw err; // не удалось создать папку
                newPath = path.resolve(pathDestDir, path.basename(currentPath))
                fs.link(currentPath, newPath, function (err) {
                  if (err) {
                    throw err;
                  }
                });
              });
            } else throw err
          });
        }
      })
    })
  })
}

try {
  fs.stat(config.entry, function (err) {
    if (!err) {
      fs.stat(config.dest, function (err) {
        if (!err) {
          reader(config.entry)
        } else if (err.code === 'ENOENT') {
          fs.mkdir(config.dest, function (err) {
            if (!err) {
              reader(config.entry, 0)
            } else {
              console.log("ошибка при создания директории ", config.dest);
            }
          })
        }
      })
    } else {
      console.log("нет исходной директории ", config.entry);
    }
  })
} catch (error) {
  console.log(error)
}