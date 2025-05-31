const functions = require("firebase-functions");
const app = require("./app");

exports.todoApi = functions.https.onRequest(app.callback());
