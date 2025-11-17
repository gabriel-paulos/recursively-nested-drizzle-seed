import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type { AnySQLiteColumn } from 'drizzle-orm/sqlite-core';

// User Table 
export const users = sqliteTable(
    'user',
    {
        id: integer().primaryKey().notNull(),
        name: text().notNull(),
        //invitedBy: integer().references((): AnySQLiteColumn => user.id), // self-referential
    },
);

export const userRelations = relations(users, ({ many, one }) => ({
    projects: many(projectTable), // A user can have many projects
    //invitedBy: one(user, { // A user can be invited by another user (self-referential)
     //   fields: [user.invitedBy],
    //    references: [user.id],
    //}),
}));

// Project Table
export const projectTable = sqliteTable(
    'project',
    {
        id: integer().primaryKey(),
        name: text().notNull(),
        userId: integer()
            .notNull()
            .references(() => users.id), // A project is owned by a user
    },
);

export const projectRelations = relations(projectTable, ({ many, one }) => ({
    tasks: many(taskTable), // A project can have many tasks
    //files: many(fileTable), // A project can have many files
    user: one(users, { // A project belongs to one user
        fields: [projectTable.userId],
        references: [users.id],
    }),
}));

// Task Table
export const taskTable = sqliteTable(
    'task',
    {
        id: integer().primaryKey(),
        name: text().notNull(),
        projectId: integer()
            .notNull()
            .references(() => projectTable.id), // A task belongs to a project
    },
);

export const taskRelations = relations(taskTable, ({ many, one }) => ({
    subtasks: many(subtaskTable), // A task can have many subtasks
    //files: many(fileTable), // A task can have many files
    project: one(projectTable, { // A task belongs to one project
        fields: [taskTable.projectId],
        references: [projectTable.id],
    }),
}));

// File Table
/*
export const fileTable = sqliteTable(
    'file',
    {
        id: integer().primaryKey(),
        name: text().notNull(),
        projectId: integer()
            .notNull()
            .references(() => projectTable.id), // A file belongs to one project
    },
);

export const fileRelations = relations(fileTable, ({ many, one }) => ({
    tasks: many(taskTable), // A file can have many tasks
    project: one(projectTable, { // A file belongs to one project
        fields: [fileTable.projectId],
        references: [projectTable.id],
    }),
}));
*/


// Subtask Table
export const subtaskTable = sqliteTable(
    'subtask',
    {
        id: integer().primaryKey(),
        name: text().notNull(),
        taskId: integer()
            .notNull()
            .references(() => taskTable.id), // A subtask belongs to a task
    },
);

export const subtaskRelations = relations(subtaskTable, ({ many, one }) => ({
    comments: many(commentTable), // A subtask can have many comments
    task: one(taskTable, { // A subtask belongs to one task
        fields: [subtaskTable.taskId],
        references: [taskTable.id],
    }),
}));

// Comment Table
export const commentTable = sqliteTable(
    'comment',
    {
        id: integer().primaryKey(),
        text: text().notNull(),
        subtaskId: integer()
            .notNull()
            .references(() => subtaskTable.id), // A comment belongs to a subtask
    },
);

export const commentRelations = relations(commentTable, ({ one }) => ({
    subtask: one(subtaskTable, { // A comment belongs to one subtask
        fields: [commentTable.subtaskId],
        references: [subtaskTable.id],
    }),
}));
