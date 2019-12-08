/* NPM Installation Dependencies */
const jwt = require('jsonwebtoken');

const generateToken = (request, response, next) => {
  const token = jwt.sign(request.user, 'my-secret');
  request.token = token;

  return next();
}

const sendToken = (request, response) => {
  response.setHeader('x-auth-token', request.token);
  return response.status(200).send(JSON.stringify(request.user));
}

module.exports = {
  generateToken,
  sendToken
}
