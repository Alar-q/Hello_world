const express = require('express');
const passport = require('passport');

const register = require(require.main.path + '/auth/register');

const Router = express.Router();

Router.get('/', (req, res)=>{
	res.sendFile(require.main.path + '/views/auth/register.html');
});

Router.post('/', register('local'));

Router.post('/', passport.authenticate('local'), (req, res)=>{
	    res.json({
				message: 'success',
				name: req.user.name,
				email: req.user.email,
			});
});

module.exports = Router;
