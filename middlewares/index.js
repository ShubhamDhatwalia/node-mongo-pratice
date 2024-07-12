
 

const fs = require("fs");

function logReqRes(filename) {
  

  return((req, res, next) => {
    console.log("Middleware 1");
    req.userName = "shubhamdhatwalia";

    fs.appendFile(
      filename,
      `\n${Date.now()}    ${req.ip}    ${req.method}    ${req.path}`,
      (err, data) => {
        next();
      }
    );
  });

  return((req, res, next) => {
    console.log("Middleware 2 " + req.userName);
    next();
  });
}


module.exports = { logReqRes,};