export const studentErrorHandler = (error, req, res, next) => {
    console.log(error)
    const status = error.statusCode || 500;
    const message = error.statusCode?error.message:"Internal Server Error";
    res.status(status).json({
        message,
        error:error.name|| "Server Error"
    })
}