'use strict';

const fs = require('fs');
const path = require('path');
const expect = require('chai').expect;
const p = require('../../photographers/handler.js');
const AWS = require('aws-sdk');
const spawn = require('child_process').spawn;

describe("Photographers", function(done) {
  // let db;
  before(function(done) {
    //   // test locally
    //   const defaults = {
    //     cwd: '~/Applications/dynamodb_local_latest',
    //     env: process.env
    //   };
    //   db = spawn('java', ['-Djava.library.path=DynamoDBLocal_lib',
    //     '-jar',
    //     'DynamoDBLocal.jar',
    //     '-sharedDb'
    //   ], defaults);
    //
    //   db.stdout.on('data', (data) => {
    //     console.log(`stdout: ${data}`);
    //   });
    //
    //   db.stderr.on('data', (data) => {
    //     console.log(`stderr: ${data}`);
    //   });
    //
    //   db.on('close', (code) => {
    //     console.log(`db child process exited with code ${code}`);
    //   });
    //
      AWS.config.update({
        region: "us-east-1",
        endpoint: "http://localhost:8000"
      });
      AWS.config.setPromisesDependency(null);

    //create test database
    let params = {
      AttributeDefinitions: [{
        AttributeName: "email",
        AttributeType: "S"
      }],
      KeySchema: [{
        AttributeName: "email",
        KeyType: "HASH"
      }],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      },
      TableName: "photographers"
    };
    let dynamodb = new AWS.DynamoDB();

    dynamodb.createTable(params, function(err, results) {
      if (err) {
        // console.log(err, err.stack);
        done(err);
      } else {
        dynamodb.waitFor('tableExists', {TableName: 'photographers'}, (e, r) => {
          if (e) {
            // console.log(e);
            done(e);
          } else {
            done();
          }
        });
      }
    });
  });

  after(function(done) {
    var params = {
      TableName: "photographers"
    };
    let dynamodb = new AWS.DynamoDB();
    dynamodb.describeTable(params, (e, r) => {
      if (r.TableStatus === 'ACTIVE') {
        dynamodb.deleteTable(params, function(err, data) {
          if (err) {
            done(err);
          } else {
            dynamodb.waitFor('tableNotExists', {TableName: 'photographers'}, done);
          }
          // db.kill('SIGINT');
        });
      } else {
        done();
      }
    });
  });

  it("loads photographers.json", function(done) {
    const photogs = JSON.parse(fs.readFileSync(path.join('.', 'test', 'data', 'photographers.json')));
    p.create({data:photogs}, null).then(function(data) {
      expect(data.statusCode).to.equal(200);
      // expect(r.body).to.not.be.empty;
      let dynamodb = new AWS.DynamoDB.DocumentClient();
      let params = {
        TableName: 'photographers'
      };
      let db = dynamodb.scan(params).promise();
      db.then(function(d) {
          // console.log(d);
          expect(d.Count).to.be.above(0);
          done();
      }).catch(function(e) {
        done(e);
      });
    }).catch(function(err) {
      done(err);
    });
  });
});
