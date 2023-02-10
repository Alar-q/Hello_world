const {credentials} = require(`./config`);

const mongoose = require('mongoose');
mongoose.connect(credentials.dbUri, {useNewUrlParser: true});

const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public'));

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const fileUpload = require('express-fileupload');
app.use(fileUpload());

const expiresIn = 1000 * 60 * 60 * 24 * 7;
const expressSession = require('express-session');
const MongoDBStore = require('express-mongodb-session')(expressSession);
const store = new MongoDBStore({
  uri:  credentials.dbUri,
  collection: 'sessions',
	expires: expiresIn, // 30 days in milliseconds
});
store.on('error', function(error) {
  console.log(error);
});
app.use(expressSession({
	secret: credentials.cookieSecret,
	cookie: {
    maxAge: expiresIn,
  },
	store: store,
	resave: false,
	saveUninitialized: false,
}));

const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());
const LocalStrategy = require('./auth/passport');
LocalStrategy();

app.use('/', require('./routes/root'));


const port = process.env.PORT || 3000;
app.listen(port, ()=>console.log(`port ${port}`));
