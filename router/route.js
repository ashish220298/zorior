const router = require('express').Router();
const connect = require('../config/connect')
var multer  = require('multer')
let session;
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './upload')
    },
    filename: function (req, file, cb) {
      cb(null, new Date().getTime()+file.originalname)
    }
})
var upload = multer({ storage: storage })

router.get('/',(req,res)=>{
     session=req.session;
    if(session.userid){
        connect.query(`SELECT * FROM users WHERE id = '${session.userid}'`, function (err, data) {
            if (err) throw err;
            if(data.length > 0){
                res.render('profile',{data:data[0]})
                       
            }else{
               res.redirect('/');
    
            }
        });
    }else{

        res.render('login');
    }
})

router.get('/register',(req,res)=>{
    res.render('register');
})


// Registration route...

router.post('/create',upload.single('file'),(req,res)=>{
    console.log('hello',req.body)
    console.log('file_path', req.file.filename)
    let body = req.body;
    var sql = `INSERT INTO users (first_name,last_name,email,gender,password,birthday,profile) VALUES ('${body.fname}','${body.lname}','${body.email}','${body.gender}','${body.password}','${body.birthday}','${req.file.filename}')`;
    connect.query(sql, function (err, result) {
      if (err) throw err;
      res.render('login');
    });
})

// login route...

router.post('/login',(req,res)=>{
    console.log(req.body);
    connect.query(`SELECT * FROM users WHERE email = '${req.body.email}' AND password='${req.body.password}'`, function (err, data) {
        if (err) throw err;
        if(data.length > 0){
            // res.render('profile',{data:data[0]})  
            session=req.session;
            session.userid=data[0]['id'];
            res.redirect('/');
        }else{
           console.log('Invalid login details')

        }
    });
})

//update get router...

router.get('/update/:id',(req,res)=>{
    let id = req.params.id;
    connect.query(`SELECT * FROM users WHERE id = '${id}'`, function (err, data) {
        if (err) throw err;
        if(data.length > 0){
            res.render('update',{data:data[0]})
                   
        }else{
           res.redirect('/');

        }
    });
})

router.post('/updateUser/:id',(req,res)=>{
    let id = req.params.id;
   
    let body = req.body;
    var sql = `UPDATE users SET first_name = '${body.fname}', last_name = '${body.lname}', gender='${body.gender}', birthday='${body.birthday}' WHERE id = '${id}'`;
    connect.query(sql, function (err, result) {
    if (err) throw err;
        res.redirect('/');
  });
})

// logout route

router.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;