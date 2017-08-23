'use strict';

const aws = require('aws-sdk');
const validator = require('validator');

module.exports.sendContactEmail = (event, context, callback) => {
  if (event.httpMethod === "POST" && event.body) {    
    let contact = JSON.parse(event.body);
    if (validator.isEmail(contact.email) && !validator.isEmpty(contact.name)) {      
      let msg = contact.message ? "New contact from " + contact.email + " through 101photographers - " + contact.message : "New contact from " + contact.email + " through 101photographers";
      let email = {
        Source: "101photographers Contact Form <contact@101photographers.in>",
        Destination: {
          ToAddresses: [ "satiesharma@gmail.com", "devasar@gmail.com" ]
        },
        Message: {
          Subject: {
            Data: "New contact from 101photographers"
          },
          Body: {
            Text: {
              Data: msg
            }
          }
        },
        ReplyToAddresses: [contact.email]
      };
      const ses = new aws.SES();
      let sesPromise = ses.sendEmail(email).promise();
      sesPromise.then((data) => {
        // console.log(data);
        return callback(null, {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data
          })
        });
      }).catch((error) => {
        callback(error, null);
      });      
    }
  }
};
