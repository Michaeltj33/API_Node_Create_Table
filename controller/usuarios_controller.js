const mysql = require('../database/mysql')
const tableMysql = require('../middleware/createTable')
const bcrypt = require('bcrypt')
const table = "usuarios"
var response = ""

exports.getUsuario = async (req, res, next) => {
    try {
        try {
            await tableMysql.createTableUser({
                body: {
                    table: table
                }
            }, res, next);

        } catch (error) {
            return res.status(401).json({
                menasgem: "Erro ao tentar criar Tabela " + table,
                error: error
            })
        }


        const limit = req.query._limit || process.env.LIMIT
        const query = 'SELECT * FROM ' + table + ' limit ' + limit       
        const result = await mysql.execute(query)        
        if (result.length == null) {
            return res.status(200).json({
                quantity: 0
            })
        } else {           
            response = {                
                quantity: result.length,
                usuarios: result.map(user => {
                    return {
                        id_usuario: user.id_usuario,
                        email: user.email,
                        request: {
                            tipo: 'GET',
                            descricao: "Selecione um usuário",
                            url: 'http://' + process.env.HOST + "/usuario/" + user.id_usuario
                        }
                    }
                })
            }             
        }

        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({ error: error })
    }
}

exports.postUsuario = async (req, res, next) => {
    try {
        try {
            await tableMysql.createTableUser({
                body: {
                    table: table
                }
            }, res, next);
        } catch (error) {
            return res.status(401).json({
                menasgem: "Erro ao tentar criar Tabela " + table,
                error: error
            })
        }       

        const hash = await bcrypt.hash(req.body.senha,10)
        
        const query = 'INSERT INTO ' + table + ' (email,senha) VALUES (?,?)'
        const result = await mysql.execute(query, [req.body.email, hash])
        console.log("aki2")
        response = {
            mensagem: "usuário criado com Sucesso",
            usuarioCriado: {
                id_usuario: result.insertId,
                email: req.body.email,
                request: {
                    tipo: 'GET',
                    descricao: "Selecione todos os usuários",
                    url: 'http://' + process.env.HOST + '/usuarios'
                }
            }
        }
        console.log("aki3")
        return res.status(201).json(response)

    } catch (error) {
        return res.status(500).json({ error: error })
    }
}