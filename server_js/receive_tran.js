const conn = require('./config.js');

async function receive_tran(req, res) {
  const too_id = req.session.user.id;

  try {
    const data1 = await new Promise((resolve, reject) => {
      const query = 'SELECT from_u_id, amount FROM transaction WHERE too_u_id = ?';
      conn.query(query, [too_id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    const data = [];

    await Promise.all(data1.map(async (item) => {
      const data2 = await new Promise((resolve, reject) => {
        const query = 'SELECT name FROM user WHERE id = ?';
        conn.query(query, [item.from_u_id], (err, result) => {
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

module.exports = receive_tran;