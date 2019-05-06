const express = require('express')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const session = require('express-session')
const ReactSSR = require('react-dom/server.js')
const app = express()
const serverRender = require('./util/server-render')
const handleLogin = require('./util/handle-login')
const proxyApi = require('./util/proxy')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false}))


app.use(session({
  maxAge: 10*60*1000,
  name: 'tid',
  resave: false,
  saveUninitialized: false,
  secret: 'react'
}))
app.use(favicon(path.join(__dirname, '../favicon.ico')))

app.use('/api/user', handleLogin)
app.use('/api',proxyApi)
const isDev = process.env.NODE_ENV === 'development'
if (!isDev) {
    const serverEntry = require('../dist/server-entry')
    const templatePath = path.join(__dirname,'../dist/index.html')
    const template = fs.readFileSync(templatePath,'utf8')
    app.use('/public/', express.static(path.join(__dirname,'../dist')))
    app.get('*', (req, res, next) => {
        serverRender(serverEntry, template, req, res).catch(next)
    })
} else {
    const devStatic = require('./util/dev-static.js')
        devStatic(app);
}

app.use(function (error, req, res, next) {
  res.status(500).send(error)
})

app.listen('3333',() => {
})
