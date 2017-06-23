'use strict';

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();
const tableName = "photographers";

AWS.config.setPromisesDependency(null);

var putRequest = function(n, c, e, s, m) {
  return {
    PutRequest: {
      Item: {
        name: n,
        category: c,
        email: e,
        status: s,
        comments: m
      }
    }
  };
};

var getItem = function(n, c, e, s, m) {
  return {
    "name": { S: n },
    "category": { S: c },
    "email": {S: e},
    "status": { S:s },
    "comments": { S: m }
  };
};

var response = function(b) {
  return {
    statusCode: 200,
    body: b
  };
};

module.exports.create = (event, context, callback) => {
  const photogs = event.data;
  let b = "";
  if (photogs.length > 0) {
    let putRequests = [];
    // console.log(photogs);
    // photogs.forEach(function(photog) {console.log(photog);});
    return Promise.all(photogs.forEach(function(p) {
      // putRequests.push(putRequest(photog.name, photog.category, photog.email, photog.status, photog.comments));
      let params = {
        TableName: 'photographers',
        Item: getItem(p.name, p.category, p.email, p.status, p.comments)
      };
      // console.log(params);
      return dynamodb.putItem(params).promise();
    }));
    // callback(null, response(b));
  }
};
