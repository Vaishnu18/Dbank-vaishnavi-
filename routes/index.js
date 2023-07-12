var express = require('express');
const app = express()
app.set('view-engine', 'ejs')
var router = express.Router();
var database = require('../server_js/config');
const server = require('../server.js')


// /* GET home page. */
// router.get('/new-transaction',server.checkAuthenticated ,(req, res, next)=>{
//   res.render('new-transaction', { name : req.session.user.name });
// });


// router.get('/logout', function(request, response, next){

//     request.session.destroy();

//     response.redirect("/");

// });


module.exports = router;