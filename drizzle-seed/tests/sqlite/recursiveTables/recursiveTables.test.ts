import BetterSqlite3 from 'better-sqlite3';
import { sql } from 'drizzle-orm';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { afterAll, afterEach, beforeAll, expect, test } from 'vitest';
import { reset, seed } from '../../../src/index.ts';
import * as schema from './sqliteSchema.ts';

let client: BetterSqlite3.Database;
let db: BetterSQLite3Database;

beforeAll(async () => {
    client = new BetterSqlite3(':memory:');

    db = drizzle(client);

    // 2  table case
    /*
    db.run(
        sql`
            CREATE TABLE users
            (
                id          INTEGER NOT NULL PRIMARY KEY,
                name        TEXT NOT NULL,
                invitedBy   INTEGER,
                FOREIGN KEY (invitedBy) REFERENCES user(id)
            );
        `,
    );
    */

    db.run(
        sql`
            CREATE TABLE user
            (
                id          INTEGER NOT NULL PRIMARY KEY,
                name        TEXT NOT NULL
            );
        `,
    );

    db.run(
        sql`
            CREATE TABLE project
            (
                id        INTEGER NOT NULL PRIMARY KEY,
                name      TEXT NOT NULL,
                userId    INTEGER NOT NULL,
                FOREIGN KEY (userId) REFERENCES user(id)
            );
        `,
    );

    // 3 tables case
    db.run(
        sql`
            CREATE TABLE task
            (
                id         INTEGER NOT NULL PRIMARY KEY,
                name       TEXT NOT NULL,
                projectId  INTEGER NOT NULL,
                FOREIGN KEY (projectId) REFERENCES project(id)
            );
        `,
    );

    db.run(
        sql`
            CREATE TABLE subtask
            (
                id       INTEGER NOT NULL PRIMARY KEY,
                name     TEXT NOT NULL,
                taskId   INTEGER NOT NULL,
                FOREIGN KEY (taskId) REFERENCES task(id)
            );
        `,
    );
    
    db.run(
        sql`
            CREATE TABLE comment
            (
                id        INTEGER NOT NULL PRIMARY KEY,
                text      TEXT NOT NULL,
                subtaskId INTEGER NOT NULL,
                FOREIGN KEY (subtaskId) REFERENCES subtask(id)
            );
        `,
    );
});

afterEach(async () => {
    await reset(db, schema);
});

afterAll(async () => {
    client.close();
});

test('2 nested tables test', async () => {
    await seed(db, {
        user: schema.users,
        project: schema.projectTable,
        tasks: schema.taskTable,
    }).refine(() => ({
        user: {
            count: 3,
            with: {
                project: 2,
            },
        }
    }));

    const userTable = await db.select().from(schema.users);
    const projectTable = await db.select().from(schema.projectTable);
    const tasksTable = await db.select().from(schema.taskTable);

    expect(userTable.length).toBe(3);
    let predicate = userTable.every((row) => Object.values(row).every((val) => val !== undefined && val !== null));
    expect(predicate).toBe(true);

    expect(projectTable.length).toBe(6);
    predicate = projectTable.every((row) => Object.values(row).every((val) => val !== undefined && val !== null));
    expect(predicate).toBe(true);

    console.log('users',userTable);
    console.log('projects',projectTable);
    console.log('tasks',tasksTable);
});

test('3 nested tables test', async () => {

    await seed(db, {
        users: schema.users,
        projects: schema.projectTable,
        tasks: schema.taskTable,
    }).refine(() => ({
        users: {
            count: 3,
            with: {
                projects: 2,
                 with: {
                    tasks: 2,
                },
            },
        }
    }));

    const userTable = await db.select().from(schema.users);
    const projectTable = await db.select().from(schema.projectTable);
    const taskTable = await db.select().from(schema.taskTable);

    console.log(userTable);
    console.log(projectTable);
    console.log(taskTable);

    expect(userTable.length).toBe(3);
    let predicate = userTable.every((row) => Object.values(row).every((val) => val !== undefined && val !== null));
    expect(predicate).toBe(true);

    expect(projectTable.length).toBe(6);
    predicate = projectTable.every((row) => Object.values(row).every((val) => val !== undefined && val !== null));
    expect(predicate).toBe(true);

    expect(taskTable.length).toBe(12);
    predicate = taskTable.every((row) => Object.values(row).every((val) => val !== undefined && val !== null));
    expect(predicate).toBe(true);


});
/*
test('4 nested tables test', async () => {

    await seed(db, {
        users: schema.user,
        projects: schema.projectTable,
        tasks: schema.taskTable,
        subtasks: schema.subtaskTable,
    }).refine(() => ({
        users: {
            count: 2,
            with: {
                projects: 2,
                    with: {
                        tasks: 2,
                            with: {
                                subtasks: 3,
                            },
                    },
            },
        }
    }));

    const userTable = await db.select().from(schema.user);
    const projectTable = await db.select().from(schema.projectTable);
    const taskTable = await db.select().from(schema.taskTable);
    const subtaskTable = await db.select().from(schema.subtaskTable);

    expect(userTable.length).toBe(2);
    let predicate = userTable.every((row) => Object.values(row).every((val) => val !== undefined && val !== null));
    expect(predicate).toBe(true);

    expect(projectTable.length).toBe(6);
    predicate = projectTable.every((row) => Object.values(row).every((val) => val !== undefined && val !== null));
    expect(predicate).toBe(true);

    expect(taskTable.length).toBe(12);
    predicate = taskTable.every((row) => Object.values(row).every((val) => val !== undefined && val !== null));
    expect(predicate).toBe(true);

    expect(subtaskTable.length).toBe(36);
    predicate = subtaskTable.every((row) => Object.values(row).every((val) => val !== undefined && val !== null));
    expect(predicate).toBe(true);
});

test('5 nested tables test', async () => {
    await seed(db, {
        users: schema.user,
        projects: schema.projectTable,
        tasks: schema.taskTable,
        subtasks: schema.subtaskTable,
        comments: schema.commentTable,
    }).refine(() => ({
        users: {
            count: 2,
            with: {
                projects: 2,
                with: {
                    tasks: 2,
                    with: {
                        subtasks: 3,
                        with: {
                            comments: 1,
                        },
                    },
                },
            },
        }
    }));

    const userTable = await db.select().from(schema.user);
    const projectTable = await db.select().from(schema.projectTable);
    const taskTable = await db.select().from(schema.taskTable);
    const subtaskTable = await db.select().from(schema.subtaskTable);
    const commentTable = await db.select().from(schema.commentTable);

    expect(userTable.length).toBe(2);
    let predicate = userTable.every((row) => Object.values(row).every((val) => val !== undefined && val !== null));
    expect(predicate).toBe(true);

    expect(projectTable.length).toBe(6);
    predicate = projectTable.every((row) => Object.values(row).every((val) => val !== undefined && val !== null));
    expect(predicate).toBe(true);

    expect(taskTable.length).toBe(12);
    predicate = taskTable.every((row) => Object.values(row).every((val) => val !== undefined && val !== null));
    expect(predicate).toBe(true);

    expect(subtaskTable.length).toBe(36);
    predicate = subtaskTable.every((row) => Object.values(row).every((val) => val !== undefined && val !== null));
    expect(predicate).toBe(true);

    expect(commentTable.length).toBe(36);
    predicate = commentTable.every((row) => Object.values(row).every((val) => val !== undefined && val !== null));
    expect(predicate).toBe(true);

    console.log(userTable);
    console.log(projectTable);
    console.log(taskTable);
    console.log(subtaskTable);
    console.log(commentTable);
});
*/