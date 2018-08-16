const service = require('services/user-service');
const passport = require('passport');

module.exports = function(app) {
    app
        .get('/users', getUsers)
        .get('/users/:id', getUser)
        .put('/users/:id', updateUser)
        .delete('/users/:id', deleteUser)
        .get('/profile', passport.authenticate(['jwt', 'facebook-token']), profile) // TODO: Remove
}

function profile(req, res, next) {
  res.send(req.user);
}

function getUsers (req, res) {
    if (req.query.page && req.query.perPage) {
        service.getPageUsers(req.query.page, req.query.perPage, res);
    } else {
        service.getAllUsers(res);
    }
}

function getUser(req, res) {
    if (req.params.id) {
        service.getUser(req.params.id, res);
    } else {
        res.status(400).end();
    }
}

function updateUser(req, res) {
    if (req.params.id && req.body.firstName && req.body.lastName
        && req.body.email && req.body.phoneNumber) {
        service.updateUser(req.params.id, req.body, res);
    } else {
        res.status(400).end();
    }
}

function deleteUser(req, res) {
    if (req.params.id) {
        service.deleteUser(req.params.id, res);
    } else {
        res.status(400).end();
    }
}
