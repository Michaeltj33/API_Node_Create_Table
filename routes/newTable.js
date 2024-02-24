const express = require('express')
const router = express.Router()
const newTableController = require('../controller/newTable_controller')

router.get('/',newTableController.getTable)

router.post('/create',newTableController.CreateTable)
module.exports = router