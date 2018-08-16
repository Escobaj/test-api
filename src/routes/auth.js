const express = require('express');
const router  = express.Router();
const jwt = require('jsonwebtoken');
const passport = require("passport");
const config = require('config');
const Users = require('models/User');
const uuidv1 = require('uuid/v1');
const UsersServices = require('services/user-service');

module.exports  = function(app) {
  app
  .post('/register', register)
  .post('/login', login)
  .get('/logout', logout)
  .get('/profile2', passport.authenticate(['jwt', 'facebook-token']), test) // TODO: Test route for authenticate
  .post('/auth/facebook/token', (req, res, next) => {

    passport.authenticate('facebook-token', (err, user, info) => {

      console.log(req.body.access_token);

      if (err || !user) {
        console.log(err);
        return res.status(400).json({
          message: info ? info.message : 'Login failed',
          user   : user
        });
      }

      req.login(user, {session: true}, (err) => {
        if (err) {
          res.send(err);
        }
        const token = jwt.sign(user.toJSON(), config.jwt.secret);

        return res.json({user, token});
      });

      next();
    })(req, res, next);
  })
};

function test(req, res, next) {
  res.send(req.user);
}

function register(req, res, next) {
  let newUser = new Users({
    id: req.body.id,
    email: req.body.email,
    firstName: req.body.firstname,
    lastName: req.body.lastname,
    phoneNumber: req.body.phone,
    pictureUrl: "",
    registrationDate: Date.now(),
    password: req.body.password,
    provider: "Local",
    social: {}
  });
  newUser.save((err, new_user) => {
    if (err)
      return res.send(err);
    res.status(200).send(new_user);
  });
}

function login (req, res, next) {
  Users.findOne({ email: req.body.email }, function (err, user) {
    if (err) { return next(err); }
    if (!user) { return next(err) }
    if (user.password === req.body.password) {
      req.login(user, {session: true}, (err) => {
        if (err) {
          res.send(err);
        }
        const token = jwt.sign(user.toJSON(), config.jwt.secret);

        return res.json({user, token});
      });
    } else {
      res.status(401).send("Bad identifiant!");
    }
  });

}

function logout(req, res, next) {
  req.logout();

  res.status(200).send({message: ""});
}
