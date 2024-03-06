const express = require('express')
const router = express.Router()
const newTableController = require('../controller/newTable_controller')

router.get('/select',newTableController.selectTable)
router.get('/',newTableController.showTable)


router.post('/create',newTableController.CreateTable)
router.post('/addcolumn',newTableController.addColumn)
router.post('/rename',newTableController.renameTable)

router.delete('/droptable', newTableController.dropTable)
router.delete('/dropcolumn', newTableController.dropColumn)
router.delete('/truncate', newTableController.truncate)

module.exports = router