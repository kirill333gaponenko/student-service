import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';

import {notFoundHandler} from "../middleware/notFoundHandler.js";
import {studentErrorHandler} from "../middleware/errorHandler.js";

describe('Testing ErrorMiddleware', () => {
    it ('should return 404 for unknown route', async () => {
        const app = express();
        app.use(express.json());
        app.use(notFoundHandler);
        app.use(studentErrorHandler);
        const response = await request(app).get('/unknown-route');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            "message": "Route not found!",
            "error": "NotFoundError",
        })
    });
    it ('should return 500 for unexpected error', async () => {
        const app = express();
        app.get('/boom', (req, res, next) => {
            next(new Error('Unexpected crash'));
        });
        app.use(studentErrorHandler);
        const response = await request(app).get('/boom');
        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            "message": "Internal Server Error",
            "error": "Error",
        })
    })
})