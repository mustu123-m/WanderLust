const Listing=require('../models/listing');
module.exports.index=async (req,resp)=>{
    // throw new ExpressError("Hatt",501);
    const allListings=await Listing.find({});
   resp.render("listing/index.ejs",{allListings});
}
module.exports.addNew=async (req,resp)=>{
    resp.render("listing/add.ejs");
}
module.exports.show=async(req,resp)=>{
    const {id}=req.params;
    console.log("Hello");
    const listing=await Listing.findById(id).populate({path:"reviews",populate:"author"}).populate("owner");
    const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAP_API_TOKEN;

const geocodingClient = mbxGeocoding({ accessToken: mapboxToken });
console.log(listing);
        const response = await geocodingClient
            .forwardGeocode({
                query: listing.location,
                limit: 1
            })
            .send();

        const match = response.body.features[0];
        const [lng, lat] = match.center;
        console.log(`Coordinates for : [${lng}, ${lat}]`);
        const coordinates=[lng,lat];
    resp.render("listing/show.ejs",{listing,coordinates});
}
module.exports.insert=async (req,resp)=>{
 
     let {title,price,location,country}=req.body;
    
   const result=await Listing.insertMany([
        {
            title:title,
            image:{
            url:req.file.path
            },
            price:price,

            location:location,
            country:country,
            owner:req.user._id
        }
    ])
    console.log(result);
    req.flash("success","New Listing Created Successfully")
    resp.redirect("/listing");
}
module.exports.editForm=async (req,resp)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
      if(!listing){
        req.flash("error","Listing Does not Exist");
    }
    resp.render("listing/edit.ejs",{listing})
}
module.exports.edit=async (req,resp)=>{
       let {id}=req.params;
       let listing=req.body;
       let orglisting=await Listing.findById(id).populate("owner");
       if(req.user._id.equals(orglisting.owner._id))
       {
    let listing2=await Listing.findByIdAndUpdate(id,listing);
    console.log("Image is");
    console.log(req.file);
    if(req.file){
     listing2.image={
        filename:req.file.originalname,
        url:req.file.path
     }
     await listing2.save();
    }
   resp.redirect(`/listing/${id}`);
 }
 else{
       req.flash("error","You are not the owner of this listing");
       resp.redirect(`/listing/${id}`)
 }
}
    module.exports.delete=async (req,resp)=>{
       let {id}=req.params;
   let listing= await Listing.findById(id).populate("owner");
   if(req.user._id.equals(listing.owner._id))
       {
    await Listing.findByIdAndDelete(id);
   req.flash("success","Listing Deleted Successfully")
   resp.redirect("/listing");
      }
else{
    req.flash("error","You are not the owner of this listing");
   resp.redirect(`/listing/${id}`);
}
}