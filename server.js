if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const transaction = require('./server_js/transactions')
const sent_tran = require ('./server_js/sent_tran')
const receive_tran = require ('./server_js/receive_tran')
const acc_sum= require ('./server_js/acc_summary')
const updateprofile = require ('./server_js/updateprofile')
const changepass = require ('./server_js/change_pass')
const express = require('express')
const path = require('path')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')

const session = require('express-session')
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));
const methodOverride = require('method-override')
app.use(express.static(path.join(__dirname, 'src')));
const initializePassport = require('./passport-config')
const validate = require('./server_js/login_auth')
const register = require('./server_js/register')
var cookieParser = require("cookie-parser");

const flash = require('connect-flash')
app.use(flash());

const users = []

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  key: "user_sid",
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {
      maxAge: 1000 * 60 * 10
    }
   
}))


// Middleware to check session expiration
// app.use((req, res, next) => {
//   if (req.session && req.session.cookie && req.session.cookie.expires < new Date()) {
//     // The session has expired
//     req.session.destroy(); // Destroy the expired session
//   }
//   next();
// });

app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/index', checkNotAuthenticated, (req, res) => {
  res.render('index.ejs')
})
app.get('/Dashboard', checkAuthenticated, async (req, res) => {
 
  // res.send(await acc_sum(req,res));
  res.render('acc-summary.ejs', { name:req.session.user.name,Data:await acc_sum(req,res),picurl:req.session.user.picurl})
})
 app.get('/acc-summary', checkAuthenticated,async (req, res) => {
  
  // res.send(await acc_sum(req,res));
  // ,Data:await acc_sum(req,res)
  res.render('acc-summary.ejs', { name:req.session.user.name,Data:await acc_sum(req,res),picurl:req.session.user.picurl})
})
app.get('/edit-profile', checkAuthenticated, (req, res) => {
  
  if (req.originalUrl === '/edit-profile') {
    // Handle logic specific to /example-route
    console.log( "hello")
    // ...
  }
  data ={
    name:req.session.user.name,
    email:req.session.user.email,
    Phone_no:req.session.user.Phone_no,
    addr:req.session.user.addr
  }
  res.render('edit-profile.ejs', { name:req.session.user.name,Data:data})
})

app.get('/profile-updated', checkAuthenticated, (req, res) => {
  
  data ={
    name:req.session.user.name,
    email:req.session.user.email,
    Phone_no:req.session.user.Phone_no,
    addr:req.session.user.addr
  }
  res.render('edit-profile.ejs', { name:req.session.user.name,Data:data,message:"Profile Updated"})
})

app.post('/edit-profile',checkAuthenticated,(req,res)=> {

  updateprofile(req,res)
})
app.post('/profile-updated',checkAuthenticated,(req,res)=> {

  updateprofile(req,res)
})

app.get('/change-password', checkAuthenticated, async (req, res) => {
 
  res.render('change-password.ejs', { name:req.session.user.name})

})
app.post('/change-password',checkAuthenticated,(req,res)=> {

  changepass(req,res)
})

app.get('/define-limit', checkAuthenticated, (req, res) => {
  // console.log( "hello")
  res.render('define-limit.ejs', { name:req.session.user.name})
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs',{success : ""})
})

app.post('/login',(req,res)=> {

  validate(req,res)
   
  

})

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs',{success : ""})
})

app.post('/register',(req, res) => {
  register(req,res)
})
app.get('/new-trans', checkAuthenticated,(req, res) => {
  res.render('new-transaction.ejs', { name:req.session.user.name,message:"Transaction successfully added" ,error : ""}) 
})
app.get('/new-tranf', checkAuthenticated,(req, res) => {
  res.render('new-transaction.ejs', { name:req.session.user.name,message:"",error:"Transaction failed"}) 
})

app.get('/new-transaction', checkAuthenticated,(req, res) => {
  res.render('new-transaction.ejs', { name:req.session.user.name,message:"",error:""}) 
})
app.post('/new-transaction',checkAuthenticated,(req, res) => {
  if (req.body.check_BT == "on") {
    console.log('Blockchain transaction');

    transaction.tran_B(req,res) // Blockchain transaction

  } else {
    console.log('Simple transaction');

    transaction.tran(req,res) // Simple transaction
  }
  // res.send('Form submitted');
})

 app.get('/sent-transaction', checkAuthenticated,async (req, res) => {
  // console.log(await sent_tran(req, res))
  res.render('sent-transaction.ejs', { name:"Yogesh",message:"",error:"",Data: await sent_tran(req, res)}) 
})
app.get('/received-transaction', checkAuthenticated,async (req, res) => {
  // console.log(await receive_tran(req, res))
  res.render('received-transaction.ejs', { name:"Yogesh",message:"",error:"",Data: await receive_tran(req, res)}) 
})
app.get('/blockchain-transaction',checkAuthenticated, async (req, res) => {
  // console.log(await receive_tran(req, res))
  res.render('blockchain-transaction.ejs', { name:"Yogesh",message:"",error:"",Data: await receive_tran(req, res)}) 
})

app.delete('/logout', (req, res) => {

  req.logout(function(err) {  // do this
      if (err) { return next(err); }
          res.redirect('/login')
  })// do this

})

function checkAuthenticated(req, res, next) {
  if (req.session.user) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.session.user) {
    return res.redirect('/Dashboard')
  }
  next()
}


// Check session where is it defined 

var listener =app.listen(3001, () => {
  console.log('Server listening on port 3000 visit localhost:'+listener.address().port);
});

// const Routes = require("./routes/index.js")

// app.use(Routes);
// module.exports = {
//   checkAuthenticated,
//   checkNotAuthenticated
// }