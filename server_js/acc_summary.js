const conn = require('./config.js');

async function acc_sum(req, res) {
  try {
    const u_id = req.session.user.id;

    const sql1 = `SELECT SUM(amount) AS total FROM transaction WHERE from_u_id = ${u_id}`;
    const sql2 = `SELECT SUM(amount) AS total FROM transaction WHERE too_u_id = ${u_id}`;
  
    const sql3 = `SELECT Balance from user WHERE id = ${u_id}`;

    const sql4 = `SELECT count(amount) AS tran_count FROM transaction where too_u_id = ${u_id} or from_u_id = ${u_id}`;
    const tranCountResult = await query(sql4)
    const balanceResult = await query(sql3)
    const sentAmountResult = await query(sql1);
    const receivedAmountResult = await query(sql2);

    const sentAmount = sentAmountResult.length > 0 ? sentAmountResult[0].total : 0;
    const receivedAmount = receivedAmountResult.length > 0 ? receivedAmountResult[0].total : 0;
    const balance = balanceResult.length > 0? balanceResult[0].Balance : 0;
    const tran_count = tranCountResult.length > 0 ? tranCountResult[0].tran_count : 0;
    
   

    user = {
        id : req.session.user.id,
        username : req.session.user.username,
                name : req.session.user.name,
                acc_id : req.session.user.acc_id,
                email : req.session.user.email,
                Phone_no : req.session.user.Phone_no,
                address : req.session.user.addr,
                Balance : req.session.user.Balance
    }
    const Data = {
      sentAmount,
      receivedAmount,
      balance,
      tran_count,
      user
    };
    return Data;
    // res.send(Data);
  } catch (err) {
    console.log(err.message);
    return res.status(500).send('Internal Server Error');
  }
}

function query(sql) {
  return new Promise((resolve, reject) => {
    conn.query(sql, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

module.exports = acc_sum;
