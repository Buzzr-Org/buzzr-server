const redis = require('redis');

const clientObj = {
    password: process.env.REDIS_PW,
    socket:{
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
};

const client = redis.createClient(clientObj);


client.connect().then(() => {
    console.log('Redis Connected');
}).catch((err) => {
    console.log(err);
});
  
module.exports = client;
