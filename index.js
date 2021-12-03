require('dotenv-safe').config()
var bodyParser = require('body-parser')
var express = require('express')
var app = express()
var router = require('./routers/routers')


app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('/', router)

app.listen(process.env.PORT, () => {
    console.clear()
    console.log(`Servidor rodando na porta ${process.env.PORT}`)
})
