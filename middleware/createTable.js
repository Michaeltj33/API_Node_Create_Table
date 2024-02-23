const mysql = require('../database/mysql')

exports.createTableUser = async (req, res) => {
    const table = req.body.table
    const verify = "SELECT TABLE_NAME FROM information_schema.tables WHERE table_NAME ='" + table + "'"
    const resp = await mysql.execute(verify)
    if (!resp.length > 0) {
        return
    } else {
        //criar nova tabela
        const query = "create table IF NOT EXISTS " + req.body.table + "(id_usuario int primary key not null auto_increment,email varchar(50),senha varchar(50));"
        await mysql.execute(query)
        return
    }
}

exports.creteTableProdutos = async (req, res) => {
    const table = req.body.table
    const verify = "SELECT TABLE_NAME FROM information_schema.tables WHERE table_NAME ='" + table + "'"
    const resp = await mysql.execute(verify)
    if (!resp.length > 0) {
        return
    } else {
        //criar nova tabela
        const query = "create table IF NOT EXISTS " + req.body.table + "(id_produto int primary key not null auto_increment,nome varchar(100),preco int);"
        await mysql.execute(query)
        return
    }
}