module.exports = function (app) {

  let authRoute = require('./auth');
  app.use('/', authRoute);

  let adminRoute = require('./admin');
  app.use('/admin', adminRoute);

  let apiRoute = require('./api');
  app.use('/api', apiRoute);

  let testRoute = require('./test');
  app.use('/test', testRoute);
  // let driverRoute = require('./driver');
  // app.use('/driver', driverRoute);

  // let autoUrl = require('./auto-url');
  // app.use('/auto-url', autoUrl);
}