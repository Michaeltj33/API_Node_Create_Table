const mysql = require('mysql')
require('dotenv/config')

const pool = mysql.createPool({
    "user": process.env.USER,
    "password": process.env.PASSWORD,
    "database": process.env.DATABASE,
    "host": process.env.HOST,
    "port": process.env.PORTSERVER
})

exports.execute = (query, params = []) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((error, conn) => {
            if (error) {
                reject(error)
            } else {
                conn.query(query, params, (error, result, fields) => {
                    conn.release()
                    if (error) {
                        reject(error)
                    } else {
                        resolve(result)
                    }
                })
            }
        })
    })
}


exports.pool = pool