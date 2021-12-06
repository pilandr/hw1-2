const path = require('path')
const fs = require('fs')

function readdir (src) {
  return new Promise((resolve, reject) => {
    fs.readdir(src, (err, files) => {
      if (err) reject(err)
      resolve(files)
    })
  })
}

function link (src, dest) {
  return new Promise((resolve, reject) => {
    fs.link(src, dest, (err, stats) => {
      if (err) reject(err)
      resolve()
    })
  })
}

function stat (src) {
  return new Promise((resolve, reject) => {
    fs.stat(src, (err, stats) => {
      if (err) reject(err)
      resolve(stats)
    })
  })
}

function mkdir (src) {
  return new Promise((resolve, reject) => {
    fs.mkdir(src, err => {
      if (err) reject(err)
      resolve()
    })
  })
}

const config = {
  entry: process.argv[2] ? path.resolve(__dirname, process.argv[2]) : path.resolve(__dirname, "sourceFolder"),
  dest: process.argv[3] ? path.resolve(__dirname, process.argv[3]) : path.resolve(__dirname, "destFolder"),
}

async function reader(src) {

  const files = await readdir(src);

  files.forEach(async function (file, ind, array) {
    const currentPath = path.resolve(src, file)
    const stats = await stat(currentPath)
    if (stats.isDirectory()) {
      reader(currentPath)
    } else {
      console.log('file', currentPath)
      const pathDestDir = path.resolve(config.dest, path.basename(currentPath)[0].toUpperCase())
      console.log('destFolder', pathDestDir);
      try {
        await stat(pathDestDir)
        newPath = path.resolve(pathDestDir, path.basename(currentPath))
        link(currentPath,newPath)

      } catch (err) {
        if (err.code === 'ENOENT'){
          await mkdir(pathDestDir)
          newPath = path.resolve(pathDestDir, path.basename(currentPath))
          link(currentPath,newPath)
        } else {
          console.log(err);
          return
        }
      }
    }
  })
}

(async () => {
  try {
    await stat(config.entry)
    try {
      await stat(config.dest)
    } catch (err) {
      if (err.code === 'ENOENT') {
        await mkdir(config.dest)
        reader(config.entry)
        return
      } else {
        console.log(err);
        return
      }
    }
    reader(config.entry)
  } catch (err) {
    console.log("нет исходной директории ", err);
  }
})()
