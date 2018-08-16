const User = require('../models/User')
const Picture = require('../models/Picture')

exports.getAllUsers = (res) => {
    User.find({}, ["id", "firstName", "lastName", "email", "phoneNumber", "pictureUrl", "registrationDate"], {limit: 20, sort: {registrationDate: -1}}, (err, response) => {
        if (err || !response) {
          res.status(404).send({"message": `No user registered.`})
        } else {
            let count = response.length
            if (count == 0) {
              res.status(404).send({"message": `No user registered.`})
            }
            else {
              res.json({
                  items: response,
                  totalPages: Math.ceil(count / 20),
                  totalEntries: count
              })
            }
        }
    });
}

exports.getPageUsers = (page, perPage, res) => {
    User.find({}, ["id", "firstName", "lastName", "email", "phoneNumber", "pictureUrl", "registrationDate"], {skip: perPage * page, limit: parseInt(perPage, 10), sort:{registrationDate: -1}}, (err, response) => {
        if (err) {
            res.status(404).json(response);
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

exports.getUser = (id, res) => {
    User.findOne({"id": id}, ["id", "firstName", "lastName", "email", "phoneNumber", "pictureUrl", "registrationDate"], {sort: {registrationDate: -1}}, (err, response) => {
        if (err) {
          res.status(404).send(err)
        } else if (!response) {
          res.status(204).send({"message": `User '${id}' does not exist.`})
        } else {
            res.json(response)
        }
    })
}

exports.updateUser = (id, body, res) => {
    User.findOneAndUpdate({id}, {$set: {firstName: body.firstName,
                                        lastName: body.lastName,
                                        email: body.email,
                                        phoneNumber: body.phoneNumber}
    },(err, response) => {
        if (err) {
          res.status(404).send(err)
        } else {
            User.findOne({id}, (err, response) => {
                if (err) {
                  res.status(400).send({"message": `User '${id}' does not exist.`})
                } else {
                    res.json(response);
                }
            })
        }
    })
}

exports.deleteUser = (id, res) => {
    User.remove({"id": id}, (err) => {
        if (err) {
            res.status(404).json(err);
        } else {
            Picture.remove({userId: id}, (err) => {
                res.status(200).json({result: "done"});
            })
        }
    })
}

exports.registerUser = (user) => {
  User.findOne({'email': user.email}, (error, existing_user) => {
    if (error || existing_user) {
      return existing_user
    }
    else {
      let newUser = new Users({
        id: user.id,
        email: user.email,
        firstName: user.firstname,
        lastName: user.lastname,
        phoneNumber: user.phone,
        pictureUrl: user.pictureUrl,
        registrationDate: user.registrationDate,
        password: user.password,
        provider: user.provider,
        social: user.social
      });
      newUser.save((error, new_user) => {
        if (error) {
          return error
        }
        return new_user
      });
    }
  })
}
