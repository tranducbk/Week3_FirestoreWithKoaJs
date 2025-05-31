const Koa = require("koa");
const koaBody = require("koa-body").default;
const admin = require("firebase-admin");
const cors = require('@koa/cors');
const serviceAccount = require("../serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
};

const routes = require("./routes/routes");
const app = new Koa();

app.use(koaBody({
  json: true,
  urlencoded: true,
  strict: false,
}));

app.use(cors(corsOptions));
app.use(routes.routes());
app.use(routes.allowedMethods());

module.exports = app;