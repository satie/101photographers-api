'use strict';

const sesForwarder = require('aws-lambda-ses-forwarder');

module.exports.sendContactEmail = (event, context, callback) => {
  if (event.httpMethod === "POST" && && event.body.name && event.body.email && event.body.message) {
    const response = {
      statusCode: 200,
      name: event.name,
      email: event.email,
      message: event.message
    };
  } else {
    const response = {
      statusCode: 500,
      errorMessage: 'Invalid request'
    };
  }

  callback(null, response);
};
