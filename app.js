const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = require('./router/route')
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const port = 8080;
// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(sessions({
    secret: "thisissecretkey",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/upload'));
app.use(cookieParser());


app.use(router);
app.listen(port,()=>{
    console.log(`app is running on Port No: ${port}`)
})