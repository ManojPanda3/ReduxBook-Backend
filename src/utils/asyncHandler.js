const asyncHandler = (func) => {
  return async (req, res, next) => {
    try {
      await func(req, res, next);
    } catch (err) {
      res.status(err.status || 500).json({
        success: false,
        message: err.message
      })
    }
  }
}

export default asyncHandler;
