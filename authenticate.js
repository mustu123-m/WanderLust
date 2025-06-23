module.exports.isAuthenticated=(req,resp,next)=>{
    if(!req.isAuthenticated())
 {
       req.session.redirectUrl=req.originalUrl;
        req.flash("error","You need to signup or login before adding a listing");
        resp.redirect("/login");
 }
 else next();
}
module.exports.saveRedirectUrl=(req,resp,next)=>{
    if(req.session.redirectUrl)
    {
     resp.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}