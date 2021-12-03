var knex = require('../database/connection')
var User = require('./User')

class PasswordToken{
    async create(mailto){
        var user = await User.findByEmail(mailto)

        if(user != undefined){
            var token = Date.now()
            try{
                await knex.insert({
                    user_id: user.id,
                    used: 0,
                    token: token
                })
                .table("passwordtokens")
                return {
                    status: true,
                    token
                }
            }
            catch(error){
                return {status: false, error: error}
            }
            
        }
        else{
            return {
                status: false,
                error: "Email não encontrado"
            }
        }
    }

    async validate(token){
        try {
            var result = await knex.select()
            .where({
                token: token
            })
            .table("passwordtokens")
            if(result.length > 0){
                var tk = result[0]
                if(tk.used){
                    return {
                        status: false,
                        error: "token já usado"
                    } 
                }
                else{
                    return {
                        status: true,
                        token:tk
                    } 
                }
            }
            else{
                return {
                    status: false,
                    error: "token inválido"
                } 
            }
        }
        catch(error){
            return {
                status: false,
                error: "Erro ao buscar token"
            }
        }
    }

    async setUsed(token){
        await knex.update({used: 1})
        .where({token: token})
        .table("passwordtokens")
    }
}


module.exports = new PasswordToken()