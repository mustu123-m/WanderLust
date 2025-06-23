require('dotenv').config();
const exp=require('express');
const mongoose=require('mongoose');
const app=exp();
const flash=require('express-flash');
const session=require('express-session');
const MongoStore = require('connect-mongo');
const port=8080;
const path=require('path');
const methodOverride=require('method-override');
const passport=require('passport');
const localStratergy=require('passport-local');
const User=require('./models/user.js');
const ExpressError=require('./util/ExpressError.js');
const asyncWrap=require('./asyncWrap.js')
const {ListingSchema,ReviewSchema}=require('./schemaValidate.js');
const listingRoute=require('./routes/listing.js');
const reviewRoute=require('./routes/review.js');
const userRoute=require('./routes/user.js');

const validateListing=(req,resp,next)=>{
  const {error}=ListingSchema.validate(req.body);
    console.log(error);
    if(error) throw new ExpressError(error,501);
    else next();
}
const validateReview=(req,resp,next)=>{
    console.log(ReviewSchema);
  const {error}=ReviewSchema.validate(req.body);
    console.log(error);
    if(error) throw new ExpressError(error,501);
    else next();
}
app.use(methodOverride("_method"));
app.listen(port,()=>{
    console.log("Server Started")
});
app.use(exp.static(path.join(__dirname,"/public"))
);
  const store= MongoStore.create({
    mongoUrl:process.env.MONGO_URL,
    secret:"supersecret",
    touchAfter:24*3600
  })
app.use(session({
  store,
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}))

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"))
app.use(exp.urlencoded({extended:true}));
const engine = require('ejs-mate');
app.engine('ejs', engine);
app.use((req,resp,next)=>{

  resp.locals.success=req.flash("success");
  resp.locals.error=req.flash("error");
  resp.locals.currUser=req.user;
  next();
})
app.get("/demouser",async (req,resp)=>{
  const demouser=new User({
    email:"Xyz@gmail.com",
    username:"mustu123"
  });
 console.log( await User.register(demouser,"typo123"));
});
app.use("/listing",listingRoute);
app.use("/listing/:id/review",reviewRoute);
app.use("/",userRoute);
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URL);

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

app.get("/",(req,resp)=>{
    resp.send("Hi");
});

app.use((req,resp,next)=>{
    throw new ExpressError("Page not found",404);
})
app.use((err,req,resp,next)=>{
    const message=err.message
  if(!err.status) err.status=500;
 resp.status(err.status).render("listing/error.ejs",{message})
})
