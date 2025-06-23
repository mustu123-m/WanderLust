const express=require('express');
const multer  = require('multer');
const {cloudinary,storage}=require('../cloudConfig.js');
const upload = multer({ storage });
const route=express.Router();
const {isAuthenticated,saveRedirectUrl}=require('../authenticate.js');
const asyncWrap=require('../asyncWrap.js')
const Listing=require('../models/listing.js');
const Review=require('../models/reviews.js');
const ExpressError=require('../util/ExpressError.js');
const {ListingSchema,ReviewSchema}=require('../schemaValidate.js');
const ListingController=require('../controllers/listing.js');
const validateListing=(req,resp,next)=>{
  const {error}=ListingSchema.validate(req.body);
    console.log(error);
    if(error) throw new ExpressError(error,501);
    else next();
}
route.get("/",asyncWrap(ListingController.index));
route.get("/new",isAuthenticated,asyncWrap(ListingController.addNew)
)
route.get("/:id",asyncWrap(ListingController.show));
route.post("/",isAuthenticated,upload.single('image[url]'),validateListing,asyncWrap(ListingController.insert))

route.get("/:id/edit",isAuthenticated,asyncWrap(ListingController.editForm));
route.patch("/:id",isAuthenticated,upload.single('image[url]'),validateListing,asyncWrap(ListingController.edit));
route.delete("/:id",isAuthenticated,asyncWrap(ListingController.delete));

module.exports=route;