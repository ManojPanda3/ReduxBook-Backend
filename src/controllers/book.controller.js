import Book from "../models/book.model.js"
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Storage } from "../index.js"
import Tags from "../models/tag.model.js";

// get the books details 
export const getBook = asyncHandler(async (req, res) => {
  const { bookId, bookTitle } = req.body;
  if (!(bookId || bookTitle)) throw new ApiError(400, "Bad request,bookId or bookName is required");
  const book = await Book.findOne({
    $or: [{ bookId }, { bookTitle }],
  }).select("-file");

  if (!book) throw new ApiError(404, "The book Not Found");

  return res.status(200).json(
    new ApiResponse(200, book, "Succesfully fetched the data")
  );
});

// upload a new book 
export const uploadBook = asyncHandler(async (req, res) => {
  // extract the book details
  const { title, tags, author, description, price } = req.body;

  // if any details is not avail send api err
  if ([title, author, description, price].some((elm) => !elm?.trim())) throw new ApiError(400, "All fields are required (name,author description,price)");

  // if the authore is diff then throw api err 
  if (author != req.user?._id) throw new ApiError(403, "Forbidden to uplod book for other user");

  // looking if the tags are exist or not 
  tags.map(async (id) => {
    if (!id) throw new ApiError(400, "invelid tag id");
    const tag = await Tags.findById(id);
    if (tag) {
      tag.numOfUses += 1;
      tag.save({ validateBeforeSave: false });
    }
    else throw new ApiError(400, "invelid tag id");
  });
  // if the book with same title exist send api err
  const isBookExist = (await Book.findOne(author)) ? true : false;
  if (isBookExist) throw new ApiError(409, "Book with same title already exist");

  // upload the coverimage to the server from the user 
  const coverImagesPath = req.files.coverImages[0].path;
  if (!coverImagesPath) throw new ApiError(400, "at least 1 coverImage is required");

  // upload the coverimage to the firebase storage bucket
  const coverImage = Storage.firebaseFileUpload(coverImagesPath, "bookCoverimage");
  if (!coverImage) throw new ApiError(500, "Something went wrong while uploading coverimage");

  // get the uploaded book path
  const bookPath = req.files.book[0].path;
  if (!bookPath) throw new ApiError(400, "at least 1 coverImage is required");

  // get the uploaded book url
  const bookURL = Storage.firebaseFileUpload(bookPath, "book");
  if (!bookURL) throw new ApiError(500, "Something went wrong while uploading coverimage");

  // get the created book details 
  const book = await Book.create({
    title, tags, author, description, price, coverImage, file: bookURL
  }).select("-file");
  if (!book) throw new ApiError(500, "Unable to create books");

  return res.status(200).json(
    new ApiResponse(200, book, "successfully created book"),
  );
});

// delete a new book 
export const deleteBook = asyncHandler(async (req, res) => {
  const { BookId } = req.body;
  const book = await Book.findByIdAndRemove({ _id: BookId });
  if (!book) throw new ApiError(404, "Books deletion successfully");
  return res.status(200).json(
    new ApiResponse(200, { isBookDelete: true }, "successfully delete the book"),
  );
});

// fetch the recommended books 
export const getRecommendedBooks = asyncHandler(async (req, res) => {
  const { intresetedTags, fromTheRank, limit } = req.body;
  let books;
  if (!intresetedTags) {
    books = await Book.aggregate([
      {
        $match: {
          ranking: {
            $gt: fromTheRank || 1,
            $lt: limit || 100
          }
        }
      },
      {
        $sort: {
          ranking: 1,
        }
      }, {
        $limit: limit || 100
      }, {
        $unset: ["file"]
      }
    ]);
  }
  else {
    books = await Book.aggregate([
      {
        $match: {
          tags: {
            $in: intresetedTags
          }
        }
      }, {
        $sort: {
          ranking: 1,
        }
      }, {
        $limit: limit || 100
      }, {
        $unset: ["file"]
      }
    ]);
  }

  if (!books) throw new ApiError(404, "books not found");
  return res.status(200).json(new ApiResponse(200, books, "Succesfully fetched the data"));
});

export const buyBook = asyncHandler(async (req, res) => {
  // TODO:
  // idk lets do it later 
  return res.status(200).json(
    new ApiResponse(200, {}, "Succesfully bought the book")
  );
});
