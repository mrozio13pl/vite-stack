import { createRouter } from '../base';

export const testRouter = createRouter().get('/', async (c) => {
    return c.json({
        message: 'Hello World!',
    } as const);
});
