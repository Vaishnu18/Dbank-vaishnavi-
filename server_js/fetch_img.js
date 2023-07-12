const conn = require('./config');

function fetchImage(id) {
  return new Promise((resolve, reject) => {
    conn.query('SELECT pic FROM user WHERE id = ?',id , (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results[0].pic);
        const dataUrl = `data:image/jpeg;base64,${results[0].pic.toString('base64')}`;

   console.log(dataUrl);
   return dataUrl;
      }
    });
  });
}

// fetchImage()
//   .then((img) => {
//     // Create a data URL from the image data
//     const dataUrl = `data:image/jpeg;base64,${img.toString('base64')}`;

//    console.log(dataUrl);
//    return dataUrl;
//   })
//   .catch((error) => {
//     console.error(error);
//   });

  module.exports = fetchImage ;

