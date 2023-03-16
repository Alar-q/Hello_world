const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const bcrypt = require('bcrypt');

function initialize(passport, getUserByEmail, getUserById, findOrCreateGoogle){

    async function authenticateUser(email, password, done){
        const user = getUserByEmail(email);

        console.log("Authenticate:", user, await bcrypt.compare(password, user.password))

        if(!user){
            return done('No user with that email', false);
        }

        try{
            if(await bcrypt.compare(password, user.password)){
                return done(null, user);
            } else {
                return done('Password incorrect', false)
            }
        }
        catch(e){
            console.log(e)
            return done(e)
        }
    }

    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));


    passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/auth/google/callback"
        },
        function(accessToken, refreshToken, profile, cb) {
            /*User.findOrCreate({ googleId: profile.id }, function (err, user) {
                return cb(err, user);
            });*/
            try{
                const user = findOrCreateGoogle(profile);
                return cb(null, user);
            }catch(e){
                cb(e, false)
            }
        }
    ));

    // только при создании сессии, логин
    passport.serializeUser((user, done)=>{
        console.log('serializeUser:', user)
        done(null, user.id);
    })

    // Каждый раз когда клиент делает запрос
    passport.deserializeUser((id, done) => {
        console.log('deserializeUser:', id)
        return done(null, getUserById(id))
    })
}

module.exports = initialize;