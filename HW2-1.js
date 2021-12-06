const express = require("express");
const app = express();

const DELAY = (process.env.DELAY || 1) * 1000;
const LIMIT = (process.env.LIMIT || 5) * 1000;
const PORT = 3000;

app.get("/", (req, res, next) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  sendMessage(res)
});

function sendMessage(res) {
  let tick = 0;
  setTimeout(function run() {
    tick+=DELAY;
    if (tick > LIMIT) {
      res.send(`${(new Date()).toUTCString()}\n`)
    }
    else {
      console.log(`${(new Date()).toUTCString()}`);
      setTimeout(run, DELAY);
    }
  }, DELAY);
}


app.listen(PORT, () => {
  console.log(`server is running on port ${PORT} DELAY=${DELAY} and LIMIT=${LIMIT}`);
})

