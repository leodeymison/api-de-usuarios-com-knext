class HomeController{

    async index(req,res){
        res.send('router index')
    }

}



module.exports = new HomeController()