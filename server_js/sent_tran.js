const conn = require('./config.js');

async function sent_tran(req, res) {
  const from_id = req.session.user.id;

  try {
    const data1 = await new Promise((resolve, reject) => {
      const query = 'SELECT too_u_id, amount FROM transaction WHERE from_u_id = ?';
      conn.query(query, [from_id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    const data = [];

    await Promise.all(data1.map(async (item) => {
      const data2 = await new Promise((resolve, reject) => {
        const query = 'SELECT name FROM user WHERE id = ?';
        conn.query(query, [item.too_u_id], (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });

      data.push({ 'name': data2[0].name, 'amount': item.amount });
    }));

    console.log(data);
    return data;
  } catch (error) {
    throw error;
  }
}

module.exports = sent_tran;