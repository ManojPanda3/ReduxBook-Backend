# Features 
- login/singup
- book upload 
- rating of an book 
- bookmark a book 
- private and public book 

# library in backend 
- mongoose 
- express 
- multer 
- cors
- jwt 
- becrypt 
- cookieParser 

# models 
User: {username , fullname , email , password , _id,refreshToken,avatar,description,isVerified,BoughtBook}
Author : {_id , userId , userAccountDetails}
Book: {_id , name , tags , author:ObjectId(Author) , likes,totalReviews:, coverImage ,description,isPublic,price}


review: {_id,comment,user:ObjectId(User),to:ObjectId(Book),stars:}
