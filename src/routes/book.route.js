import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"
import authMiddleware from "../middlewares/auth.middleware.js";
import { buyBook, getBook, getRecommendedBooks, uploadBook } from "../controllers/book.controller.js";

const router = Router();

// upload the book to the db
router.route('/uploadBook').post(
  authMiddleware,
  upload.fields(
    [
      {
        name: "coverImages",
        maxCount: 1,
      },
      {
        name: "book",
        maxCount: 4,
      }
    ])
  , uploadBook);

// get the book details 
router.route('/getBook').post(getBook);

// getRecommendedBooks 
router.route('/getRecommendedBooks').post(getRecommendedBooks);

// delete the book from the db
router.route('/deleteBook').post(
  authMiddleware,
  uploadBook);

// get the book details 
router.route('/buyBook').post(authMiddleware, buyBook);


export default router;
