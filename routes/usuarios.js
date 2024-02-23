const express = require('express')
const router = express.Router()
const userController = require('../controller/usuarios_controller')

router.get('/',userController.getUsuario)
router.post('/',userController.postUsuario)

module.exports = router