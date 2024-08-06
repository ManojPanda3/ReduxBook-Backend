const asyncHandler = (func) => {
  return async (req, res, next) => {
    try {
      func(req, res, next);
    } catch (error) {
      console.error("Something went wrong while running ", func, "\nError :", error);
    }
  }
}

export default asyncHandler;
