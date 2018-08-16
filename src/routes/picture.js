const multer  = require('multer')
const mime = require('mime-types')
const fs = require('fs')
const guid    = require('../common/guid').guid
const upload  = multer({
    storage:
        multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'uploads/')
            },
            filename: function (req, file, cb) {
                req.files = file
                req.files.name =  guid() + '.'  + mime.extension(file.mimetype);
                cb(null, req.files.name)
            }
        })
})

const service = require('services/picture-service');

const Pictures = require('../models/Picture')
const Users = require('../models/User')


module.exports = function(app) {
    app
        .get('/pictures', getPictures)
        .get('/users/:userId/pictures', getUserPictures)
        .post('/users/:userId/pictures', upload.single('file'), addUserPicture)
        .delete('/users/:userId/pictures/:pictureId', deleteUserPicture)
        .put('/users/:userId/pictures/:pictureId', updateUserPicture)
        .get('/users/:userId/pictures/:pictureId', getUserPicture)
        .get('/init', init)
}

function getPictures (req, res) {
    if (req.query.page && req.query.perPage) {
        service.getPagePictures(req.query.page, req.query.perPage, res);
    } else {
        service.getAllPictures(res);
    }
}

function getUserPictures (req, res) {
    if (req.params.userId) {
        if (req.query.page && req.query.perPage) {
            service.getUserPagePictures(req.query.page, req.query.perPage, req.params.userId, res);
        } else {
            service.getUserPictures(req.params.userId, res);
        }

    } else {
        res.status(400).end();
    }
}

function addUserPicture (req, res) {
    if (req.body.description && req.body.tags && req.body.mentions && req.params.userId) {
        service.addUserPicture(req.body.description, req.files, req.body.tags, req.body.mentions, req.params.userId, res);
    } else {
        // fs.unlink('upload/' + req.file.name);
        res.status(400).end();
    }
}

function deleteUserPicture (req, res) {
    if (req.params.userId && req.params.pictureId) {
        service.deleteUserPicture(req.params.userId, req.params.pictureId, res);
    } else {
        res.status(400).end();
    }
}

function updateUserPicture (req, res) {
    if (req.body.description && req.body.mentions && req.body.tags && req.params.userId && req.params.pictureId) {
        service.updateUserPicture(req.params.userId, req.params.pictureId, req.body, res);
    } else {
        res.status(400).end();
    }
}

function getUserPicture (req, res) {
    if (req.params.userId) {
        if (req.query.page && req.query.perPage) {
            service.getUserPagePictures(req.query.page, req.query.perPage, req.params.userId, res);
        } else {
            service.getUserPictures(req.params.userId, res);
        }
    } else {
        res.status(400).end();
    }
}

function init (req, res) {
    Pictures.create({
        url: 'https://beebom-redkapmedia.netdna-ssl.com/wp-content/uploads/2016/01/Reverse-Image-Search-Engines-Apps-And-Its-Uses-2016.jpg',
        description: 'lorem ipsum',
        mentions: ['ok'],
        tags: ['ok'],
        userId: 'Stephouuu'
    });

    Users.create({
        id: "Stephouuu",
        email: "stephou@gmail.com",
        firstName: "stephane",
        lastName: "galibert",
        pictureUrl: "http://kb4images.com/images/image/37490536-image.jpg"
    });
    res.json("done");
}
