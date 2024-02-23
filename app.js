const express = require('express')
const app = express()
const produtos = require('./routes/produtos')
const usuario = require('./routes/usuarios')

const morgan = require('morgan')
require('dotenv/config')

//acesso de Domínio
app.use((_, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT , DELETE')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})

app.use(morgan("dev"))

//Trasnforma a requisição em json
app.use(express.json())

//Rotas
app.use('/produtos', produtos)
app.use('/usuarios', usuario)


//Verifica a conexão com servidor e mostra as rotas disponíveis
app.get('/',(_,res)=>{
    res.status(200).json({
        mensagem: "Servidor Rodando normalmente",
        Rotas: {
            produtos: "http://localhost:3000/produtos",
            usuario: "http://localhost:3000/usuarios",           

        }
    })
})

module.exports = app
