"use strict";
const cypress = require("cypress");
const fs = require('fs');


const results = {
    "data": null,
    "errors": null
}

exports.handler = async (event, context) => {
    console.log('STARTING CYPRESS');
    await cypress
    .run({
      config: {
        video: false
      },
      record: false
    }).then(res => {
        console.log('CYPRESS Complete');
        results.data = res;
      })
      .catch(err => {
        console.log('it errored');
        console.log(err)
        results.errors = err;
      });
    return results;
}