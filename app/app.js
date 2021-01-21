// "use strict";
// const cypress = require("cypress");
// const fs = require('fs');


// const results = {
//     "data": null,
//     "errors": null
// }

// exports.handler = async (event, context) => {
//     console.log('STARTING CYPRESS');
//     await cypress
//     .run({
//       config: {
//         video: false
//       },
//       record: false
//     }).then(res => {
//         console.log('CYPRESS Complete');
//         results.data = res;
//       })
//       .catch(err => {
//         console.log('it errored');
//         console.log(JSON.stringify(err, null, 2))
//         results.errors = err;
//       });
//     return results;
// }

const cypress = require("cypress");
const exec = require("child_process").exec;
const child_process = require("child_process");

const runCommand = (command) => {
  console.log("Running ", command);
  try {
    child_process.execSync(command, {
      stdio: "inherit",
    });
  } catch (e) {
    console.log("Error");
    console.warn(e);
  }
};

/**
 * Handler
 * @param {*} event
 */
exports.handler = async (event, context) => {
  // process.env.ELECTRON_EXTRA_LAUNCH_ARGS = "disable-dev-shm-usage";
  process.env.DEBUG = "cypress:*";
  process.env.ELECTRON_EXTRA_LAUNCH_ARGS = [
    "--disable-dev-shm-usage", // disable /dev/shm tmpfs usage on Lambda

    // @TODO: review if these are still relevant:
    "--disable-gpu",
    "--single-process", // Currently wont work without this :-(

    // https://groups.google.com/a/chromium.org/d/msg/headless-dev/qqbZVZ2IwEw/Y95wJUh2AAAJ
    "--no-zygote", // helps avoid zombies

    "--no-sandbox",

    "--disable-setuid-sandbox",
    "--user-data-dir=/tmp/chrome-user-data",

    // old stuff
    // "disable-dev-shm-usage",
    // "disable-gpu",
    // // "no-zygote",
    // // "single-process",
    // "no-sandbox",
    // "disable-software-rasterizer",
  ].join(" ");

  process.env.XDG_CONFIG_HOME = "/tmp"; //  https://github.com/electron/electron/blob/master/docs/api/app.md#appgetpathname

  runCommand("mkdir /tmp/chrome-user-data");
  runCommand("nohup Xvfb :99 &>/dev/null &");
  runCommand("mkdir /tmp/shm");

  return cypress
    .run({
      browser: "chrome",
      config: {
        video: false
      },
      record: false
    })
    .then((r) => {
      console.log("r");
      console.log(r);
      // xvfb.stop();
      return {
        status: 200,
        body: r,
      };
    })
    .catch((e) => {
      console.log("error");
      console.log(e);

      // xvfb.stop();
      return {
        status: 500,
        body: e,
      };
    });
};