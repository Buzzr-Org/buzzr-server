const client = require('./redis');

exports.setCache = async (key, value) => {
    return new Promise((resolve) => {
      client.set(key, value, (err, res) => {
        if (err) console.error(err);
        resolve(res);
      });
    });
  };
  
exports.getCache = async (key) => {
    return new Promise((resolve) => {
      client.get(key, (err, res) => {
        if (err) console.error(err);
        resolve(res);
      });
    });
};

exports.setExpiry = async (key, seconds) =>
  new Promise((resolve, reject) => {
    client.expire(key, seconds, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });

exports.getTTL = async (key) =>
  new Promise((resolve, reject) => {
    client.ttl(key, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });

exports.setExpiryAndValue = async (key, seconds, value) =>
  new Promise((resolve, reject) => {
    client.setex(key, seconds, value, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });

exports.hashSet = async (key, fieldValues) =>
  new Promise((resolve, reject) => {
    client.hset(key, ...fieldValues, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });

exports.hashGet = async (key) =>
  new Promise((resolve, reject) => {
    client.hgetall(key, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });

exports.keyExists = async (key) =>
  new Promise((resolve, reject) => {
    client.exists(key, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });

exports.keysPatternMatch = async (pattern) =>
  new Promise((resolve, reject) => {
    client.keys(pattern, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });

exports.keysDelete = async (keys) =>
  new Promise((resolve, reject) => {
    client.del(...keys, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });

exports.sortedSetAdd = async (key, field, value) =>
  new Promise((resolve, reject) => {
    client.zadd(key, value, field, (err, res) => {
      if (err) {
        console.error(err);
        return reject(err);
      }
      resolve(res);
    });
  });

exports.sortedSetIncrBy = async (key, field, value) =>
  new Promise((resolve, reject) => {
    client.zincrby(key, value, field, (err, res) => {
      if (err) {
        console.error(err);
        return reject(err);
      }
      resolve(res);
    });
  });

exports.sortedSetMemberScore = async (key, member) =>
  new Promise((resolve, reject) => {
    client.zscore(key, member, (err, res) => {
      if (err) {
        console.error(err);
        return reject(err);
      }
      resolve(res);
    });
  });

exports.sortedSetRevRange = async (key, start, stop, withScores = false) =>
  new Promise((resolve, reject) => {
    if (withScores === true)
      client.zrevrange(key, start, stop, 'withscores', (err, res) => {
        if (err) return reject(err);
        resolve(res);
      });
    else
      client.zrevrange(key, start, stop, (err, res) => {
        if (err) return reject(err);
        resolve(res);
      });
  });

exports.sortedSetRevRank = async (key, member) =>
  new Promise((resolve, reject) => {
    client.zrevrank(key, member, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });

exports.sortedSetZCount = async (key, min, max) =>
  new Promise((resolve, reject) => {
    client.zcount(key, `${min}`, `${max}`, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });

exports.setSAdd = async (key, values) => {
  return new Promise((resolve, reject) => {
    client.sadd(key, ...values, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
};

exports.setSMembers = async (key) => {
  return new Promise((resolve, reject) => {
    client.smembers(key, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
};
