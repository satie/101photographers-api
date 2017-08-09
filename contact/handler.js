'use strict';

const sesForwarder = require('aws-lambda-ses-forwarder');
const validator = require('validator');

module.exports.sendContactEmail = (event, context, callback) => {
  if (event.httpMethod === "POST" && event.body) {
    let contact = JSON.parse(event.body);
    if (validator.isEmail(contact.email) && !validator.isEmpty(contact.name)) {
      let overrides = {
        config: {
          fromEmail: "contact@101photographers.in",
          forwardMapping: {
            "@101photographers.in": [
              "satiesharma@gmail.com"
            ]
          }
        }
      };
      sesForwarder.handler(event, context, callback, overrides);
    }
    // return callback(null, {
    //   statusCode: 200,
    //   body: JSON.stringify({
    //     message: 'Hello',
    //     object: contact
    //   }),
    // });
  }
};
