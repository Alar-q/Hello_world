
// Этот сервис лучше объявлять в конструкторе UserController, а то он глобальный
const userService = require('../services/user-service');

class UserController {

    async registration(req, res, next){
        try{
            const {email, password} = req.body;
            const userData = await userService.registration(email, password);

            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })

            return res.json(userData)
        }
        catch(e){next(e)}
    }

    async login(req, res, next){
        try{

        }
        catch(e){next(e)}
    }

    async logout(req, res, next){
        try{

        }
        catch(e){next(e)}
    }

    async activate(req, res, next){
        try{
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL);
        }
        catch(e){next(e)}
    }

    async refresh(req, res, next){
        try{

        }
        catch(e){next(e)}
    }

    async getUsers(req, res, next){
        try{
            res.json(['123', '234', '356']);
        }
        catch(e){next(e)}
    }
}

module.exports = new UserController();