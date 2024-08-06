import multer from "multer";

const storage = multer.diskStorage({
  destination: function(_, __, cb) {
    cb(null, './public/temp')
  },
  filename: function(_, file, cb) {
    const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E3)
    cb(null, file.originalname + '-' + uniqueSuffix)
  }
})
export const upload = multer({ storage });
