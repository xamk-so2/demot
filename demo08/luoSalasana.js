let hash = require("crypto").createHash("SHA256").update("passu123").digest("hex");

console.log(hash);