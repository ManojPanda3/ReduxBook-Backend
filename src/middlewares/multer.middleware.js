import multer from "multer";

const storage = multer.diskStorage({
  destination: function (_, __, cb) {
    cb(null, './public/temp')
  },
  filename: function (_, file, cb) {
    const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E3)
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
})
export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    fieldSize: 8 * 1024
  }
});
