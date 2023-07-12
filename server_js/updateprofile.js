const conn = require('./config.js');

async function updateprofile(req,res){
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const address = req.body.addr;

    await conn.query('UPDATE user SET name =?, email =?, Phone_no =?, addr =? WHERE id =?',[name,email,phone,address,req.session.user.id],(err,result)=>{
        if(err) throw err;
        else {

            req.session.user.addr = address;
            req.session.user.name = name;
            req.session.user.phone = phone;
            req.session.user.email = email;
    
            res.redirect('/profile-updated');
            console.log(result);
            console.log(err);
        }
        
})
}

module.exports = updateprofile;