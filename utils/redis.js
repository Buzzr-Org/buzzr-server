const redis = require('redis');

const client = redis.createClient();

// client.connect().then(() => {
//     console.log('Redis Connected');
// }).catch((err) => {
//     console.log(err);
// });
  
module.exports = client;
