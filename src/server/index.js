const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
//var express = require('express');
//var app = express();

// server.use(middlewares)
// server.use(router)
// server.listen(3000, () => {
//   console.log('JSON Server is running')
// })

// app.listen(3000, function () {
//   console.log('Example app listening on port 3000!');
// });