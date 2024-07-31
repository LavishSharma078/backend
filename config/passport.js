const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();

module.exports = (passport) => {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    console.log("profile",profile)
    const { id  } = profile;
    try {
      let user = await User.findOne({ googleId: id });

      if (!user) {
        user = new User({
          googleId: id,
          email: profile.emails[0].value,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName
        });
        await user.save();
      }
      
      done(null, user);
    } catch (err) {
      console.error(err);
      done(err, null);
    }
  }));
};
