const mysql = require('../database/mysql')

exports.getTable = async (req, res) => {
    try {

        if (req.query.table) {
            query = "Describe " + req.query.table
        } else {
            query = "SHOW TABLES"
        }

        const result = await mysql.execute(query)
        const response = {
            quantity: result.length,
            result
        }

        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            resposta: "Tabela não Encontrada",
            error: error
        })
    }
}

exports.CreateTable = async (req, res) => {
    try {
        let execute = true

        //verefica se no body foi enviado 'table'
        if (!req.body.table) {
            return res.status(401).json({
                mensagem: "'Table' não encontrado",
                table: {
                    table: "nome da tabela",
                    id_teste: "int not null auto_increment Primary key",
                    etc: "pode colocar quantos nomes quiser"
                }
            })
        }

        //Verifica se a tabela já existe no banco de dados
        const verify = "SELECT TABLE_NAME FROM information_schema.tables WHERE table_NAME ='" + req.body.table + "'"
        const resp = await mysql.execute(verify)        
        if (resp.length > 0) {
            return res.status(409).json({
                mensagem: "Tabela já existe em nosso banco de dados"
            })
        }

        let query = "CREATE TABLE IF NOT EXISTS "

        for (let key in req.body) {
            if (execute) {
                query += req.body[key] + "("
                execute = false
            } else {
                query += key + " " + req.body[key] + ","
            }
        }
        query = query.slice(0, -1)
        query += ")"
        console.log(query)
        await mysql.execute(query)
        const response = {
            mensagem: "Tabela foi criado com Sucesso"
        }
        return res.status(201).json(response)
    } catch (error) {
        return res.status(500).json({ error: error })
    }

}

