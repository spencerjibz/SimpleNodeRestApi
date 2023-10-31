const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const { log } = console;

//  THIS THE DATA TYPE STORED IN MY DATABASE SCHEMA(MANGOD)
var UserSchema = new Schema({
  name: { type: String, trim: true },
  username: { type: String, index: { unique: true } },
  password: { type: String, required: true },
});
////  THE DATABASE SCHEMA
var User = (module.exports = mongoose.model("User", UserSchema));

module.exports.createUser = function (newUser, callback) {
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(newUser.password, salt, function (err, hash) {
      // Store hash in your password DB.

      newUser.password = hash;
      let query = new User(newUser);
      query.save(callback);
    });
  });
};
module.exports.getUserByUsername = function (username, callback) {
  var query = { username: username };
  User.findOne(query, callback);
};

module.exports.getUserById = function (id, callback) {
  // FUNCTION TO FIND THE USER BY ID AND PASSING THE USER TO PASSPORT AND FINALLY FOR USAGE IN AUTHENTICATION AND AUTHORIZATION
  User.findById(id, callback);
};

module.exports.comparePassword = function (candidatePassword, hash, callback) {
  // FUNCTIONALITY OF HASSING THE PASSWORD BEFORE IT'S STORED INTO THE DATABASE
  bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
    if (err) callback(err);
    callback(null, isMatch);
  });
};
module.exports.changedinfo = function (username, password, callback) {
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, function (err, hash) {
      // Store hash in your password DB.
      password = hash;
      // FIND THE USER BY USERNAME AND UPDATE OR CHANGE THEIR PASSWORD(THIS CAN BE MODIFIED TO CHANGED ANOTHER CREDENTIAL)
      User.findOneAndUpdate(
        { username: username },
        { password: password },
        callback,
      );
    });
  });
};
// FUNCTION THE DELETES THE USER FROM DATABASE
module.exports.deleteUser = function (username, callback) {
  User.findOneAndRemove({ username: username }, callback);
};

module.exports.collectedinfo = (cb) => {
  User.find(cb);
};
// THIS FUNCTION AUTHENTICATES THE USER  FROM THE DATABASE
module.exports.loginUser = (username, password, cb) => {
  User.getUserByUsername(username, (err, isfound) => {
    if (err) {
      cb(new Error("user not found"));
      log(isfound);
    } else {
      User.comparePassword(password, isfound.password, function (err, ismatch) {
        if (err) {
          cb(null, false);
        } else if (ismatch) {
          User.getUserByUsername(username, cb);
        } else {
          cb(new Error(" user not found"));
        }
      });
    }
  });
};
