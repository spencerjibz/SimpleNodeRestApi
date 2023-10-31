// api authorization middleware
module.exports = function (req, res, next) {
  // get the auth header value
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    // split the space between the bearerHeader
    const bearer = bearerHeader.split(" ");
    // add the token
    const bearerToken = bearer[1];
    // set the token
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
};
