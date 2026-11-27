const realNow = Date.now;

process.on("message", ({ blogTime }) => {
  Date.now = blogTime === null ? realNow : () => blogTime;
  process.send({ blogTime });
});
