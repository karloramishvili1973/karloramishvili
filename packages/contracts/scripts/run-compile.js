import('hardhat')
  .then((hardhat) => hardhat.run('compile'))
  .then(() => console.log('HARDHAT_COMPILE_SUCCESS'))
  .catch((e) => {
    console.error('HARDHAT_COMPILE_ERROR', e);
    process.exit(1);
  });
