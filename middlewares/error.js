const errorHandlingMiddleWere = (err, req, res, next) => {
    res.status(500).json({
      message: "internal server error",
      error: err.message,
    });
  };
  module.exports = errorHandlingMiddleWere;