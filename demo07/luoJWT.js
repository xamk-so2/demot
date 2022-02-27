let token = require("jsonwebtoken").sign({}, "SuuriSalaisuus!!!");

console.log(token);