// * Chỉ nhiệm vụ khai báo PORT và khởi động APP
const app = require("./src/app");

const PORT = 3055;

const server = app.listen(PORT, () => {
  console.log(`App is running in ${PORT}`);
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("Exit Server Express");
  });
});
