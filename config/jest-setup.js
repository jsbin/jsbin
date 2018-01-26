require('./env');

process.on('unhandledRejection', reason => {
  console.error(reason);
});
