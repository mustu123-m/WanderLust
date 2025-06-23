const express=require('express');
const User=require('../models/user.js');
const passport=require('passport');
const {isAuthenticated,saveRedirectUrl}=require('../authenticate.js');
const route=express.Router({mergeParams:true});
const userController=require('')

route.get("/signup",(req,resp)=>{
resp.render("user/signupform.ejs");
})
route.get("/login",(req,resp)=>{
resp.render("user/loginform.ejs");
})
route.get("/logout",(req,resp)=>{
    req.logout((err)=>{
        if(err)
        {
            next(err);
        }
    })
    req.flash("success","logged you out!");
    resp.redirect("/listing")

})
route.post("/login",saveRedirectUrl,passport.authenticate("local",
    {
        failureRedirect:"/login",
        failureFlash:true
}),
async (req,resp)=>{
req.flash("success","Welcome to WanderLust");
if(resp.locals.redirectUrl) resp.redirect(resp.locals.redirectUrl);
else resp.redirect("/listing");
});
route.post("/signup",async (req,resp)=>{
    try{
    let {email,username,password}=req.body;
    let user1=new User({email,username});
   const  result= await User.register(user1,password);
   req.login(user1,(err)=>{
    if(err) return next(err);
     req.flash("success","SignUp Successfull");
   resp.redirect("/listing");
   })
  
}
catch(e){
    console.log("Error is ");
    // console.log(e);
    req.flash("error",e.message);
    resp.redirect("/signup");
}
})
module.exports=route;