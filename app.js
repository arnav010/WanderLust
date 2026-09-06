if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError"); 
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const mongoUrl = process.env.ATLASDB_URL || process.env.MONGO_URL;
const port = process.env.PORT || 8080;

if (!mongoUrl) {
  throw new Error("Set ATLASDB_URL (or MONGO_URL) before starting the app.");
}
if (!process.env.SECRET) {
  throw new Error("Set SECRET before starting the app.");
}

async function start() {
  await mongoose.connect(mongoUrl);
  console.log("Connected to DB");
  app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
  });
}

start().catch((err) => {
  console.error("DB Connection Error:", err);
  process.exitCode = 1;
});



const store = MongoStore.create({
  mongoUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  ttl: 24 * 60 * 60,
  autoRemove: 'native',  // ensures Mongo uses TTL
  touchAfter: 24 * 3600,
});


const sessionOptions = {
  store:store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie:{
    expires: Date.now()+24*60*60*1000,
    maxAge: 24*60*60*1000,
    httpOnly:true,
    secure: process.env.NODE_ENV === "production",
  }
}

store.on("error",(err)=>{
  console.error("Session store error:", err);
})

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.get("/", (req, res) => {
  res.redirect("/listings");
});





app.use(session(sessionOptions))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser= req.user;
    next();
})


// Routes
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", userRouter);

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong!";
  res.status(statusCode).render("error.ejs", { err });
});
