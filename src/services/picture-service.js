const Picture = require('../models/Picture')
const User = require('../models/User')
const fs = require('fs');
const config = require('config');

exports.getAllPictures = (res) => {
    Picture.find({}, ["id", "url", "description", "mentions", "tags", "createdDate", "userId"], {limit: 20, sort:{createdDate: -1}}, (err, response) => {
        if (err) {
            res.status(404).json(err);
        } else {
            let count = response.length
            res.json({
                items: response,
                totalPages: Math.ceil(count / 20),
                totalEntries: count
            })
        }
    });
}

exports.getPagePictures = (page, perPage, res) => {
    Picture.find({}, ["id", "url", "description", "mentions", "tags", "createdDate", "userId"], {skip: perPage * page, limit: parseInt(perPage, 10), sort:{createdDate: -1}}, (err, response) => {
        if (err) {
            res.status(404).json(err);
        } else {
            let count = response.length;
            res.json({
                items: response,
                totalPages: Math.ceil(count / perPage),
                totalEntries: count
            })
        }
    })
}

exports.getUserPictures = (id, res) => {
    Picture.find({userId: id}, ["id", "url", "description", "mentions", "tags", "createdDate", "userId"], {limit: 20, sort:{createdDate: -1}}, (err, response) => {
        if (err) {
            res.status(404).json(err);
        } else {
            let count = response.length
            res.json({
                items: response,
                totalPages: Math.ceil(count / 20),
                totalEntries: count
            })
        }
    });
}

exports.getUserPagePictures = (page, perPage, id, res) => {
    Picture.find({userId: id}, ["id", "url", "description", "mentions", "tags", "createdDate", "userId"], {skip: perPage * page, limit: parseInt(perPage, 10)}, (err, response) => {
        if (err) {
            res.status(404).json(err);
        } else {
            let count = response.length;
            res.json({
                items: response,
                totalPages: Math.ceil(count / perPage),
                totalEntries: count
            })
        }
    })
}

exports.getUserPicture = (id, pictureId, res) => {
    Picture.find({userId: id, _id: pictureId}, ["id", "url", "description", "mentions", "tags", "createdDate", "userId"], {sort:{createdDate: -1}}, (err, response) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.json(response)
        }
    });
}

exports.addUserPicture = (description, file, tags, mentions, userId, res) => {
    Picture.create({
        url: config.site.api + file.name,
        description,
        mentions: mentions.split(","),
        tags: tags.split(","),
        userId
    }, (err, response) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.json(response);
        }
    });
}

exports.deleteUserPicture = (userId, pictureId, res) => {
    Picture.find({userId: userId, _id: pictureId}, (err, response) => {
            if (err) {
                res.status(404).json(err);
            } else {
               console.log("hello");
               //fs.unlink('uploads/' + response[1].url.split('http://localhost:8000/')[1]);
                Picture.remove({userId: userId, _id: pictureId}, (err) => {
                    if (err) {
                        res.status(404).json(err);
                    } else {
                        console.log("delete"  + userId);
                        res.status(200).end();
                    }
                })
            }
    })
}

exports.updateUserPicture = (userId, pictureId, body, res) => {
    console.log(userId, pictureId)
    console.log(body)
    Picture.findOneAndUpdate({_id: pictureId}, {$set: {
            description: body.description,
            tags: body.tags,
            mentions: body.mentions
        }
    } ,(err) => {
        if (err) {
            res.status(404).json(err);
        } else {
            Picture.find({_id: pictureId}, (err, response) => {
                res.json(response[0]);
            })
        }
    })
}
