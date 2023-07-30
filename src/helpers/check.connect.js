const mongoose = require("mongoose");
const os = require("os");
const process = require("process");
const _TIMER_CHECK = 5000; // 5 seconds

// count connect to DB
const countConnect = () => {
  const numberConnection = mongoose.connections.length;

  console.log(`Number of Connection::${numberConnection}`);

  return countConnect;
};

// check Overload

const checkOverload = () => {
  setInterval(() => {
    // get connection
    const numberConnection = countConnect();

    // get cores
    const cores = os.cpus().length;
    const maximumConnect = cores * 3;

    if (numberConnection > maximumConnect) {
      console.log("Server need update!!!!");
    }

    // get memoryUsage
    const memoryUsage = process.memoryUsage().rss;

    console.log(`Memory usage:: ${memoryUsage / 1024 / 1024} MB`);
  }, _TIMER_CHECK);
};

module.exports = {
  countConnect,
  checkOverload,
};
