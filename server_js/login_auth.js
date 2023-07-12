//import connection from Config
// import {conn} from "./config.js";
const bcrypt = require('bcrypt')
const conn = require('./config.js');
const fetchImage = require('./fetch_img.js');
// conn.query('select * from user' ,(err,res)=>{
//     //return console.log(res)
//     console.log(res[0].id)
// })
const express = require('express')
const app = express()
app.set('view-engine', 'ejs')


async function validate(req, res) {
    var username = req.body.usrname
    var password = req.body.password

    if (username && password) {
        let query = `
        SELECT * FROM user 
        WHERE username = "${username}"
        `;

        conn.query(query, async function (error, data) {

            if (data.length > 0) {
                // console.log(data[0].pass)
                if (await bcrypt.compare(password, data[0].pass)) {
                    req.session.user = { id: data[0].id, username: data[0].username, name: data[0].name, acc_id: data[0].acc_id, email: data[0].email,Phone_no : data[0].Phone_no,addr: data[0].addr,Balance: data[0].Balance,picurl: await fetchImage(data[0].id)};
                    req.session.save(() => {
                        res.redirect('/Dashboard');
                    });
                    // res.render('../views/index.ejs',{name:'Yogesh'})
                    // console.log("login_auth_" + req.session.user_id)

                    return true;
                }
                else {
                    res.send('Incorrect Password');
                    res.end();
                }

            }
            else {
                res.send('Incorrect Email Address');
                res.end();
            }
        });
    }
    else {
        res.send('Please Enter Email Address and Password Details');
        res.end();
    }

}
module.exports = validate
