const mysql = require('../database/mysql')

exports.showTable = async (req, res) => {
    try {

        if (req.query.table) {
            query = "Describe " + req.query.table
        } else {
            query = "SHOW TABLES"
        }

        // const query = "SELECT " + coluna + " FROM " + req.params.table   

        const result = await mysql.execute(query)
        const response = {
            quantity: result.length,
            result
        }

        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            resposta: "Tabela não Encontrada",
            error: error,
            tabelasDisponiveis: await mysql.execute("SHOW TABLES")
        })
    }
}

exports.CreateTable = async (req, res) => {
    try {
        let execute = true

        //verefica se no body foi enviado 'table'
        if (!req.body.table) {
            setTable(res)
        }

        //Verifica se a tabela já existe no banco de dados
        const verify = "SELECT TABLE_NAME FROM information_schema.tables WHERE table_NAME ='" + req.body.table + "'"
        const resp = await mysql.execute(verify)
        if (resp.length > 0) {
            return res.status(409).json({
                mensagem: "Tabela já existe em nosso banco de dados",
                response: {
                    tipo: "POST",
                    mensagem: "verifica todas as informações da tabela",
                    url: "http://" + process.env.HOST + ":" + process.env.PORTDB + "/newtable?table=" + req.body.table
                }
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

exports.dropTable = async (req, res) => {
    try {
        //verefica se no body foi enviado 'table'
        if (!req.body.table) {
            setTable(res)
        }

        //Verifica se a tabela já existe no banco de dados
        const verify = "SELECT TABLE_NAME FROM information_schema.tables WHERE table_NAME ='" + req.body.table + "'"
        const resp = await mysql.execute(verify)
        if (!resp.length > 0) {
            return res.status(404).json({
                mensagem: "Tabela não encontrada",
                tabelasDisponiveis: await mysql.execute("SHOW TABLES")
            })
        }

        const query = "DROP TABLE " + req.body.table
        await mysql.execute(query)
        const response = {
            mensagem: "Tabela removida com Sucesso"
        }
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({ error: error })
    }
}

exports.truncate = async (req, res) => {
    try {
        //verefica se no body foi enviado 'table'
        if (!req.body.table) {
            setTable(res)
        }

        //Verifica se a tabela já existe no banco de dados        
        const verify = "SELECT TABLE_NAME FROM information_schema.tables WHERE table_NAME ='" + req.body.table + "'"
        const resp = await mysql.execute(verify)
        if (!resp.length > 0) {
            return res.status(404).json({
                mensagem: "Tabela não encontrada",
                tabelasDisponiveis: await mysql.execute("SHOW TABLES")
            })
        }

        const query = "truncate " + req.body.table
        await mysql.execute(query)
        const response = {
            mensagem: "Dados da tabela apagada com Sucesso"
        }

        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({ error: error })
    }
}

exports.addColumn = async (req, res) => {
    try {
        //verefica se no body foi enviado 'table'
        if (!req.body.table) {
            setTable(res)
        }

        //Verifica se a tabela já existe no banco de dados
        const verify = "SELECT TABLE_NAME FROM information_schema.tables WHERE table_NAME ='" + req.body.table + "'"
        const resp = await mysql.execute(verify)
        if (!resp.length > 0) {
            return res.status(404).json({
                mensagem: "Tabela não encontrada",
                tabelasDisponiveis: await mysql.execute("SHOW TABLES")
            })
        }

        const query = "ALTER TABLE " + req.body.table + " ADD COLUMN " + req.body.coluna
        await mysql.execute(query)
        return res.status(201).json({
            mensagem: "Coluna Adiciona com Sucesso",
            response: {
                tipo: "POST",
                mensagem: "verifica todas as informações da tabela",
                url: "http://" + process.env.HOST + ":" + process.env.PORTDB + "/newtable?table=" + req.body.table
            }
        })


    } catch (error) {
        return res.status(500).json({ error: error })
    }
}

exports.dropColumn = async (req, res) => {
    try {
        //verefica se no body foi enviado 'table'
        if (!req.body.table) {
            setTable(res)
        }

        //Verifica se a tabela já existe no banco de dados
        const verify = "SELECT TABLE_NAME FROM information_schema.tables WHERE table_NAME ='" + req.body.table + "'"
        const resp = await mysql.execute(verify)
        if (!resp.length > 0) {
            return res.status(404).json({
                mensagem: "Tabela não encontrada",
                tabelasDisponiveis: await mysql.execute("SHOW TABLES")
            })
        }

        const query = "ALTER TABLE " + req.body.table + " DROP COLUMN " + req.body.coluna
        await mysql.execute(query)
        return res.status(201).json({
            mensagem: "Coluna Removida com Sucesso",
            response: {
                tipo: "POST",
                mensagem: "verifica todas as informações da tabela",
                url: "http://" + process.env.HOST + ":" + process.env.PORTDB + "/newtable?table=" + req.body.table
            }
        })



    } catch (error) {
        return res.status(500).json({ error: error })
    }
}

exports.renameTable = async (req, res) => {
    try {
        //verefica se no body foi enviado 'table'
        if (!req.body.table) {
            setTable(res)
        }

        //Verifica se a tabela já existe no banco de dados
        const verify = "SELECT TABLE_NAME FROM information_schema.tables WHERE table_NAME ='" + req.body.table + "'"
        const resp = await mysql.execute(verify)
        if (!resp.length > 0) {
            return res.status(404).json({
                mensagem: "Tabela não encontrada",
                tabelasDisponiveis: await mysql.execute("SHOW TABLES")
            })
        }

        //Veririfica se o nome da tabela que sera modificada foi informado
        if (!req.body.rename) {
            return res.status(206).json({
                mensagem: "Nome da tabela que irá substituir a existente faltando"
            })
        }

        const query = "ALTER TABLE " + req.body.table + " RENAME TO " + req.body.rename
        await mysql.execute(query)
        const response = {
            mensagem: "Tabela alterado com Sucesso",
            request: {
                tipo: "GET",
                mensagem: "verifica todas as informações da tabela",
                url: "http://" + process.env.HOST + ":" + process.env.PORTDB + "/newtable?table=" + req.body.rename

            }
        }
        return res.status(202).json(response)

    } catch (error) {
        return res.status(500).json({ error: error })
    }
}

exports.selectTable = async (req, res) => {
    try {
        //verifica se no body foi enviado 'table'
        if (!req.query.table) {
            setTable(res)
        }

        //Verifica se a tabela já existe no banco de dados
        const verify = "SELECT TABLE_NAME FROM information_schema.tables WHERE table_NAME ='" + req.query.table + "'"
        const resp = await mysql.execute(verify)
        if (!resp.length > 0) {
            return res.status(404).json({
                mensagem: "Tabela não encontrada",
                tabelasDisponiveis: await mysql.execute("SHOW TABLES")
            })
        }

        const query = "SELECT * FROM " + req.query.table

        try {
            const result = await mysql.execute(query)
        } catch (error) {
            return res.status(500).json({
                error: error,
                tabelasDisponiveis: await mysql.execute("SHOW TABLES")
            })
        }


        const response = {
            quantity: result.length,
            request: {
                tipo: 'GET',
                descricao: "Mostra todos os produtos",
                url: "http://" + process.env.HOST + ":" + process.env.PORTDB + "/newtable?table=" + req.params.table
            }
        }

        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({ error: error })
    }
}

exports.insertInto = async (req, res) => {

    //verifica se no body foi enviado 'table'
    if (!req.body.table) {
        setTable(res)
    }

     //Verifica se a tabela já existe no banco de dados
     const verify = "SELECT TABLE_NAME FROM information_schema.tables WHERE table_NAME ='" + req.body.table + "'"
     const resp = await mysql.execute(verify)
     if (!resp.length > 0) {
         return res.status(404).json({
             mensagem: "Tabela não encontrada",
             tabelasDisponiveis: await mysql.execute("SHOW TABLES")
         })
     }

    const arrayList = []

    const describe = await mysql.execute('describe ' + req.body.table)

    //captura os nomes da coluna da tabela e joga dentro de um array
    for (let x = 0; x < describe.length; x++) {
        arrayList.push(describe[x].Field)
    }

    let query = "INSERT INTO " + req.body.table + " ("
    let finalQuery = ""

    for (let x = 0; x < arrayList.length; x++) {
        query += arrayList[x]
        finalQuery += verifyColumTable(req, arrayList[x])
        if (x < arrayList.length - 1) {
            query += ", "
            finalQuery += ", "
        } else {
            query += ") VALUES ("
            finalQuery += ")"
        }
    }


    query += finalQuery

    const result = await mysql.execute(query)

    const response = {
        mensagem: "cadastro inserido com sucesso",

        request: {
            tipo: 'GET'
        }
    }

    return res.status(201).json(response)


}

// **** FUNCTIONS ****

//retorna o valor da coluna
function verifyColumTable(req, Column) {
    if (req.body[Column]) {
        return '"' + req.body[Column] + '"'
    }
    return "null"
}

/* async function verifyTable(req, res, type) {
    let getType = ""   
    if (type == "query") {
        getType = req.query.table
    }else {
         getType = req.body.table
    }

    //Verifica se a tabela já existe no banco de dados
    const verify = "SELECT TABLE_NAME FROM information_schema.tables WHERE table_NAME ='" + getType + "'"
    try {
        const resp = await mysql.execute(verify)
        if (!resp.length > 0) {
            return res.status(404).json({
                mensagem: "Tabela não encontrada",
                tabelasDisponiveis: await mysql.execute("SHOW TABLES")
            })
        }
    } catch (error) {
        return res.status(500).json({
            mensagem: "Problema ao tentar verificar tabela no banco de dados",
            error: error
        })
    }

} */


function setTable(res) {
    return res.status(401).json({
        mensagem: "'Table' não encontrado",
        Createtable: {
            table: "nome da tabela",
            id_teste: "int not null auto_increment Primary key",
            etc: "pode colocar quantos nomes quiser"
        }
    })
}

