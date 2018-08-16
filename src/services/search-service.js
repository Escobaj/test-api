const Picture = require('../models/Picture')
const User = require('../models/User')

exports.search = (query, res) => {
    User.find({$or: [
      { id: { $regex: '.*' + query + '.*' } },
      { firstName: { $regex: '.*' + query + '.*' } },
      { lastName: { $regex: '.*' + query + '.*' } }
    ]}, ["id", "firstName", "lastName", "pictureUrl"], {}, (errUser, responseUser) => {

        if (errUser) {
            res.status(404).json(responseUser);
        } else {
            Picture.find({tags:{ $regex: '.*' + query + '.*' }}, ["url", "description", "userId", "tags", "mentions"], {}, (errTag, responseTag) => {
                if (errTag) {
                    res.status(404).json(responseTag);
                } else {
                    Picture.find({description:{ $regex: '.*' + query + '.*' }}, ["url", "description", "userId", "tags", "mentions"], {}, (errDescription, responseDescription) => {
                        if (errDescription) {
                            res.status(404).json(responseDescription);
                        } else {
                            res.json({
                                tag: responseTag,
                                description: responseDescription,
                                user: responseUser,
                            })
                        }
                    })
                }
            })
        }
    })
}

exports.searchUser = (query, res) => {
    User.find({id:{ $regex: '.*' + query + '.*' }}, ["id", "firstName", "lastName", "pictureUrl"], {}, (err, response) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.json({
                items: response,
            })
        }
    })
}

exports.searchTag = (query, res) => {
    Picture.find({tags:{ $regex: '.*' + query + '.*' }}, ["url", "description", "tags", "userId"], {}, (err, response) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.json({
                items: response,
            })
        }
    })
}

exports.searchDescription = (query, res) => {
    Picture.find({description:{ $regex: '.*' + query + '.*' }}, ["url", "description", "tags", "userId"], {}, (err, response) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.json({
                items: response,
            })
        }
    })
}
