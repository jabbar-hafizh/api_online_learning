exports.responseSuccess = (res, data = null, message = 'OK', code = 200) => {
  res.status(200).json({
    status: 'Success',
    code: code,
    message: message,
    data: {
      doc: data,
    },
  });
};

exports.responseFailed = (res, message = 'Fail', code = 400) => {
  res.status(400).json({
    status: 'Fail',
    code: code,
    message: message,
    data: null,
  });
};
