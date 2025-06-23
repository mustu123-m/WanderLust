const Listing=require('../models/listing');
const Review=require('../models/reviews');
module.exports.post=async(req,resp)=>{
     let {id}=req.params;
     console.log("Post request Arrived");
    const listing=await Listing.findById(id);
    console.log(req.body);
    const review=new Review(req.body.review);
    review.author=req.user._id;
    await review.save();
   listing.reviews.push(review);
   const result=await listing.save();
   resp.redirect(`/listing/${id}`);
}
module.exports.delete=async(req,resp)=>{
    let {id,review_id}=req.params;
    console.log("hello");
   let orgreview=await Review.findById(review_id).populate("author");
   if(orgreview.author._id.equals(req.user._id))
   {
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:review_id}});
    await Review.findByIdAndDelete(review_id);
    resp.redirect(`/listing/${id}`);
   }
   else
   {
    req.flash("error","The comment is not Added by you");
     resp.redirect(`/listing/${id}`);
   }
}