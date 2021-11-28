const path = require('path')
const { readdir, stat, link, access, constants, mkdir } = require('fs')
const fs = require('fs')

const config = {
  entry: path.resolve(__dirname, "sourceFolder"),
  dest: path.resolve(__dirname, "destFolder"),
}

function reader(src) {
  fs.readdir(src, function (err, files) {
    if (err) throw err

    if (!files.length) throw new Error('нет файлов!')

    files.forEach(function (file) {
      const currentPath = path.resolve(src, file)
      fs.stat(currentPath, function (err, stats) {
        if (err) throw err

        if (stats.isDirectory()) {
          reader(currentPath)
        } else {
          console.log('file', currentPath)
          pathDestDir = path.resolve(config.dest, path.basename(currentPath)[0].toUpperCase())
          console.log('destFolder', pathDestDir);
          fs.stat(pathDestDir, function (err) {
            if (!err) {
              console.log("существует");
              newPath = path.resolve(pathDestDir, path.basename(currentPath))
              fs.link(currentPath, newPath, function (err) {
                if (err) {
                  throw err;
                }
                console.log("скопрована после существования");
              });
            }
            else if (err.code === 'ENOENT') {
              console.log("не существует");
              fs.mkdir(pathDestDir, err => {
                if (err) throw err; // не удалось создать папку
                console.log('Папка успешно создана');
                newPath = path.resolve(pathDestDir, path.basename(currentPath))
                fs.link(currentPath, newPath, function (err) {
                  if (err) {
                    throw err;
                  }
                  console.log("скопрована после создания");
                });
              });
            }
          });
        }
      })
    })
  })
}

try {
  reader(config.entry)
} catch (error) {
  console.log(error)
}