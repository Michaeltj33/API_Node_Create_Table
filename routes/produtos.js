const express = require('express')
const router = express.Router()
const produtos = require('../controller/produtos_controller')
// const tableMysql = require('../middleware/createTable')

router.post('/',produtos.postProduto)

router.get('/',produtos.getProdutos)

module.exports = router
