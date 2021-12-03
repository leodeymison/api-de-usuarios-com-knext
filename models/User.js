var knex = require('../database/connection')
var bcrypt = require('bcryptjs');
const PasswordToken = require('./PasswordToken');

class User{

    async findAdll(){
        try{
            var result = await knex.select("id", "mailto", "name", "func", "createdAt", "updatedAt")
            .table("users");
            return result;
        }
        catch(error){
            console.log(error)
            return [];
        }
    }
    async findById(id){
        try{
            var result = await knex.select("id", "mailto", "name", "func", "createdAt", "updatedAt")
            .where({id: id})
            .table("users");
            if(result.length > 0 || typeof(id) == Number){
                return result[0];
            }
            else{
                return undefined
            }
        }
        catch(error){
            console.log(error)
            return undefined;
        }
    }

    async findByEmail(mailto){
        try{
            var result = await knex.select("id", "mailto","password", "name", "func", "createdAt", "updatedAt")
            .where({mailto: mailto})
            .table("users");
            if(result.length > 0 || typeof(id) == Number){
                return result[0];
            }
            else{
                return undefined
            }
        }
        catch(error){
            console.log(error)
            return undefined;
        }
    }

    async create(mailto, password, name, func){
        try{
            var hash = await bcrypt.hash(password, 10)
            await knex.insert({
                mailto, 
                password: hash, 
                name, 
                func,
                createdAt: '2021-09-23 18:00:46',
                updatedAt: '2021-09-23 18:00:46'
            }).table("users");
        }
        catch(error){
            console.log(error)
        }
        
    }

    async findEmail(email){
        try{
            var result = await knex.select("*")
            .from("users")
            .where({
                mailto: email
            })
            if(result.length > 0){
                return true
            }
            else{
                return false
            }
        }
        catch(error){
            console.log(error)
            return false
        }
        
    }


    async update(id, name, mailto, func){
        var user = await this.findEmail(id)

        if(user !== false){

            var editUser = {};

            if(mailto !== undefined){
                if(mailto !== user.mailto){
                    var result = await this.findEmail(mailto)
                    if(result == false){
                        editUser.mailto = mailto;
                    }
                    else{
                        return {
                            status: false, 
                            error: "O email já está cadastrado"
                        }
                    }
                }
                else{
                    return {
                        status: false, 
                        error: "O novo campo de email não pode ser igual ao anterior"
                    }
                }
            }
            else{
                return {
                    status: false, 
                    error: "Campo email indefinido"
                }
            }
            
            if(name !== undefined){
                editUser.name = name;
            }
            else{
                return {
                    status: false, 
                    error: "Campo nome indefinido"
                }
            }
            if(func !== undefined){
                editUser.func = func;
            }
            else{
                return {
                    status: false, 
                    error: "Campo função indefinido"
                }
            }


            try{
                await knex.update(editUser)
                .where({id: id})
                .table("users")
                return {status: true}
            }
            catch(error){
                return {status: false, error: error}
            }
        }
        else{
            return {
                status: false, 
                error: "O Usuário não existe"
            }
        }
    }

    async delete(id){
        var user = await this.findById(id)
        if(user != undefined){
            try{
                await knex.delete()
                .where({id: id})
                .table("users")
                return {
                    status: true
                }
            }
            catch(error){
                return {
                    status: false, 
                    error: "Erro ao excluir resistro"
                }
            }
            
        }
        else{
            return {
                status: false, 
                error: "Usuário não existe"
            }
        }
    }

    async changePassword(newPassword, id, token){
        var hash = await bcrypt.hash(newPassword, 10)
        await knex
        .update({password: hash})
        .where({id: id})
        .table("users")

        // adicionar como usado
        await PasswordToken.setUsed(token)
    }
}

module.exports = new User()