const serverless = require('serverless-http');
const app = require('./app');
const { loadSsmParameters } = require('./config/ssm');

let cachedHandler;

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (!cachedHandler) {
    await loadSsmParameters();
    cachedHandler = serverless(app);
  }

  return cachedHandler(event, context);
};