const session = require("express-session");

const MongoStore = require("connect-mongo");

module.exports = (app) => {
  app.set("trust proxy", 1);

  app.use(
    session({
      secret: process.env.SESS_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: {
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge:  60 * 60 * 24,
      },
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI || "mongodb://localhost/basic-auth",

        // ttl => time to live
        ttl: 60 * 60 * 24, // 60sec * 60min * 24h => 1 day
      }),
    })
  );
    //Middleware to update value of the cart
    app.use((req, res, next) => {
      if (req.session.loggedUser) {
        res.locals.session = req.session
      }
      next()
    })
};