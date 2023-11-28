const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/socialNetworkAPI", 
module.exports = mongoose.connection;