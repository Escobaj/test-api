const service = require('services/search-service');

module.exports = function(app) {
    app
        .get('/search', search)
        .get('/search/user', searchUser)
        .get('/search/tag', searchTag)
        .get('/search/description', searchDescription)
}

function search (req, res) {
    if (req.query.query) {
        service.search(req.query.query, res)
    } else {
        res.status(400).end()
    }
}

function searchUser (req, res) {
    if (req.query.query) {
        service.searchUser(req.query.query, res)
    } else {
        res.status(400).end()
    }
}

function searchTag (req, res) {
    if (req.query.query) {
        service.searchTag(req.query.query, res)
    } else {
        res.status(400).end()
    }
}

function searchDescription (req, res) {
    if (req.query.query) {
        service.searchDescription(req.query.query, res)
    } else {
        res.status(400).end()
    }
}
