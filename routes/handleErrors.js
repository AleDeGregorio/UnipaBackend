const { GeneralError } = require('../utils/errors');

const handleErrors = (err, req, res, next) => {
  if (err instanceof GeneralError) {
    return res.status(err.getCode()).json({
      status: 'error',
      message: err.message,
      code: err.getCode()
    });
  }

  try {
    var c = err.getCode();
  } catch (error) {
    c = 500;
  }
  
  return res.status(500).json({
    status: 'error',
    message: err.message,
    code: c
  });
}


module.exports = handleErrors;