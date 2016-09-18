
// Injects options if running inside an OpenShift cloud, from some OpenShift-
// specific environment vars

module.exports = function (options) {

  if (!process.env.OPENSHIFT_APP_NAME) {
    return;
  }

  process.env.PORT = process.env.OPENSHIFT_NODEJS_PORT;
  options.host = process.env.OPENSHIFT_NODEJS_IP;  // Node shall listen on this network interface only
  options.url.host = process.env.OPENSHIFT_APP_DNS;
  options.url.ssl = true;

  options.env = 'production';


  // Set this with "rhc env set JSBIN_SESSION_SECRET [value]"
  options.session.secret = process.env.JSBIN_SESSION_SECRET;


  if (process.env.OPENSHIFT_MYSQL_VERSION) {
    options.store.adapter = 'mysql';
    options.store.mysql.host = process.env.OPENSHIFT_MYSQL_DB_HOST;
    options.store.mysql.port = process.env.OPENSHIFT_MYSQL_DB_PORT;
    options.store.mysql.username = process.env.OPENSHIFT_MYSQL_DB_USERNAME;
    options.store.mysql.password = process.env.OPENSHIFT_MYSQL_DB_PASSWORD;
    options.store.mysql.database = process.env.OPENSHIFT_APP_NAME;
  }

};
