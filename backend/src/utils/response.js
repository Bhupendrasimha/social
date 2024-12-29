const createResponse = ({
    res,
    statusCode = 200,
    message = '',
    data = null,
    error = null
  }) => {
    const status = statusCode >= 200 && statusCode < 400 ? 'success' : 'error';
    
    const responseBody = {
      status,
      statusCode,
      message,
      ...(data && { data }),
      ...(error && { error })
    };
  
    return res.status(statusCode).json(responseBody);
  };
  

  const successResponse = (res, data, message = 'Success', statusCode = 200) => {
    return createResponse({
      res,
      statusCode,
      message,
      data
    });
  };
  
  const errorResponse = (res, message = 'Error occurred', statusCode = 500, error = null) => {
    return createResponse({
      res,
      statusCode,
      message,
      error
    });
  };