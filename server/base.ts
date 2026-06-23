import { Hono } from 'hono';

export const createRouter = () =>
    new Hono<{
        Variables: {
            /* place for defining typesafe global hono variables */
        };
    }>();
