import {NotFoundError} from "../errors/NotFoundError.js";

export const notFoundHandler = async (req, res, next) => {
    next (new NotFoundError("Route not found!"));
}