var User = require('../models/User');
var PasswordTokens = require('../models/PasswordToken');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

var secret = process.env.SECRET

class UserController{
    async index(req,res){
        var result = await User.findAdll();
        res.json(result)
        return;
    }

    async findById(req,res){
        var id = req.params.id;
        var user = await User.findById(id)
        if(user==undefined){
            res.status(404)
            res.json({error: "Nenhum valor encontrado"})
        }
        else{
            res.status(200)
            res.json(user)
        }
    }

    async create(req,res){
        var { name, mailto, password, func} = req.body;
        if(mailto !== undefined && mailto !== null && mailto !== ''){
            if(password !== undefined && password !== null && password !== ''){
                if(func !== undefined && func !== null && func !== ''){
                    try{
                        var emailExiste = await User.findEmail(mailto)
                        if(emailExiste){
                            res.status(406)
                            res.json({error: "O email já está cadastrado!"})
                            return
                        }
                        else{
                            await User.create(mailto, password, name, func)
                            res.status(200)
                            res.json({
                                name,
                                mailto,
                                password,
                                func
                            })
                            return; 
                        }
                        
                    }
                    catch(error){
                        console.log(error)
                        return;
                    }
                }
                else{
                    res.status(400)
                    res.json({error: 'func inválido'})
                    return;
                }
            }
            else{
                res.status(400)
                res.json({error: 'password inválido'})
                return;
            }
        }
        else{
            res.status(400)
            res.json({error: 'email inválido'})
            return;
        }
    }

    async update(req,res){
        var {id, name, func, mailto} = req.body
        var result = await User.update(id, name, mailto, func)

        if(result != undefined){
            if(result.status){
                res.status(200)
                res.send("Atualizado com sucesso")
            }
            else{
                res.status(406)
                res.json(result)
            }
        }
        else{
            res.status(406)
            res.send("Correu um erro no servidor")
        }
    }
    async delete(req,res){
        var id = req.params.id
        var result = await User.delete(id)
        if(result.status){
            res.status(200)
            res.send("Ok")
        }
        else{
            res.status(406)
            res.json({result})
        }
    }

    async recoverPassowrd(req,res){
        var mailto = req.body.mailto;

        var result = await PasswordTokens.create(mailto)

        if(result.status){
            res.status(200)
            res.json(result)
        }
        else{
            res.status(406)
            res.json(result)
        }
    }

    async changePassword(req,res){
        var token = req.body.token
        var password = req.body.password

        var isTokenValid = await PasswordTokens.validate(token)

        if(isTokenValid.status){
            await User.changePassword(password, isTokenValid.token.user_id, isTokenValid.token.token)
            res.status(200)
            res.send("Senha alterada")
        }
        else{
            res.status(406)
            res.json(isTokenValid)
        }

    }

    async login(req,res){
        var { mailto, password} = req.body

        var user = await User.findByEmail(mailto)
        if(user !== undefined){
            var result = await bcrypt.compare(password, user.password);
            if(result){
                var token = jwt.sign({
                    mailto: user.mailto,
                    func: user.func
                }, secret)

                res.status(200)
                res.send({
                    token: token
                })
            }
            else{
                res.status(406)
                res.send("Senha incorreta")
            }
        }
        else{
            res.status(406)
            res.send("Email incorreta")
        }
    }
}

module.exports = new UserController()