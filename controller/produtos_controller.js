const mysql = require('../database/mysql')
const tableMysql = require('../middleware/createTable')
const table = "produtos"

exports.getProdutos = async (req, res, next) => {
    try {
        await tableMysql.creteTableProdutos({
            body: {
                table: table
            }
        }, res, next);

        const limit = req.query._limit || process.env.LIMIT
        const query = 'SELECT * FROM ' + table + ' limit ' + limit
        const result = await mysql.execute(query)
        const response = {
            quantity: result.length,
            produtos: result.map(prod => {
                return {
                    id_produto: prod.id_produto,
                    nome: prod.nome,
                    preco: prod.preco,
                    request: {
                        tipo: 'GET',
                        descricao: "Retorna os detalhes de um produto específico",
                        url: "http://" + process.env.HOST + "/produtos/" + prod.id_produto
                    }
                }
            })
        }       
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({ error: error })
    }
}

exports.postProduto = async (req, res) => {
    try {        
        await tableMysql.creteTableProdutos({
            body: {
                table: table
            }
        }, res);      
       
        const query = "INSERT INTO " + table + " (nome,preco) VALUES (?,?)"
        const result = await mysql.execute(query, [req.body.nome, req.body.preco])
        const response = {
            mensagem: "Cadastro criado sucesso",
            produtoCriado: {
                id_produto: result.insertId,
                email: req.body.email
            }
        }
        return res.status(201).json(response)

    } catch (error) {
        return res.status(500).json({ error: error })
    }


}