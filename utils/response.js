exports.responseSuccess = (res, data = null, message = 'OK', code = 200) => {
  return res.status(200).json({
    status: 'Success',
    code: code,
    message: message,
    data: data,
  });
};

exports.responseFailed = (res, message = 'Fail', code = 400) => {
  return res.status(400).json({
    status: 'Fail',
    code: code,
    message: message,
    data: null,
  });
};
