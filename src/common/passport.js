const passport = require('passport');
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const Users = require('models/User');
const config = require('config');
const uuidv1 = require('uuid/v1');
const UsersServices = require('services/user-service');
const jwt = require('jsonwebtoken');
const FacebookTokenStrategy = require( "passport-facebook-token");

passport.use(new FacebookTokenStrategy({
  clientID: "980291155480802",
  clientSecret: "67262536ada402707041166763627420",
  // profileFields   : [ "id", "birthday", "displayName", "gender", "email", "picture" ],
  // scope           : [ "email", "user_birthday", "user_about_me" ],
}, (token, refresh, profile, done) => {

  console.log("FacebookTokenStrategy", token);
  let data = profile._json;

  UsersServices.registerUser(
    {
      id: uuidv1(),
      email: data.email,
      firstName: data.name,
      lastName: data.name,
      phoneNumber: data.phone,
      pictureUrl: "",
      registrationDate: Date.now(),
      password: data.password,
      provider: "facebook",
      social: {
        id: profile.id,
        token: token,
      }
    }
  );

  Users.findOne({'email': data.email}, (error, response) => {
    return done(null, response);
  })
}));


passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey   : config.jwt.secret
},
function (jwtPayload, cb) {

  console.log("JWTStrategy", jwtPayload)

  return Users.findOne({ email: jwtPayload.email }, function (err, user) {
    if (err) { return cb(err); }
    if (!user) { return cb(null, false, {message: 'Incorrect email or password.'}) }
    if (user.password != jwtPayload.password) { return cb(null, false, {message: 'Incorrect email or password.'}) }
    return cb(null, user, {message: 'Logged In Successfully'});
  });
}
));

// Used to serialize the user for the session:
passport.serializeUser( ( user, done ) => {
  console.log(">>>", user);
  done(null, user);
} );

// Used to deserialize the user:
passport.deserializeUser( ( id, done ) => {
  console.log(">>", id);
  Users.findById( id )
  .then( user => done( null, user ) )
  .catch( err => done( err ) );
} );
