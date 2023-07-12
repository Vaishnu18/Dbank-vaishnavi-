const conn = require('./config');
const bcrypt = require('bcrypt');

function getUserPassword(req) {
  return new Promise((resolve, reject) => {
    conn.query('SELECT pass from user where id = ?', req.session.user.id, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result[0]?.pass);
      }
    });
  });
}

function updateUserPassword(req,newPassword) {
  return new Promise((resolve, reject) => {
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    conn.query('UPDATE user SET pass = ? WHERE id = ?', [hashedPassword,  req.session.user.id], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

async function changepass(req, res) {
  const { oldpass, newpass, confirmpass } = req.body;

  if (newpass === confirmpass) {
    try {
      const userPassword = await getUserPassword(req);

      if (userPassword && await bcrypt.compare(oldpass, userPassword)) {
        await updateUserPassword(req,newpass);
        res.send("Password Changed Successfully");
      } else {
        res.send("Old Password Doesn't Match");
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.send("New Password and Confirm Password Don't Match");
  }
}

module.exports = changepass;
