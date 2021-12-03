var jwt = require("jsonwebtoken")
var secret = process.env.SECRET
module.exports = function(req,res,next){
    const authToken = req.headers['authorization']

    if(authToken !== undefined){
        const bearer = authToken.split(' ');
        var token = bearer[1];

        try{
            var decoded = jwt.verify(token, secret)
            if(decoded.func == "Administrador"){
                next()
            }
            else{
                res.status(403)
                res.send("Você não tem permissão para essa rota")
                return;
            }
            
        }
        catch(error){
            res.status(403)
            res.send("Você não está autenticado")
            return;
        }
    }
    else{
        res.status(403)
        res.send("você não está autorizado")
        return;
    }
}