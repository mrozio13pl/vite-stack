import { desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { todos } from '@/lib/db/schema';
import { createRouter } from '../base';

export const todosRouter = createRouter().get('/', async (c) => {
    const rows = await db.select().from(todos).orderBy(desc(todos.createdAt)).limit(20);

    return c.json(rows);
});
