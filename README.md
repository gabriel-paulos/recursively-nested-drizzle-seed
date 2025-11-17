
This is a fork of Drizzle-ORM and I wanted to add recursively nested references: for example 

The following table: 

```mermaid
graph TD;
    user[(user)]
    project[(project)]
    task[(task)]
    subtask[(subtask)]
    comment[(comment)]

    user -- "1" --> project;
    project -- "1" --> task;
    task -- "1" --> subtask;
    subtask -- "1" --> comment;

    user[/"user table"/] -->|FK| project;
    project[/"project table"/] -->|FK| task;
    task[/"task table"/] -->|FK| subtask;
    subtask[/"subtask table"/] -->|FK| comment;
```

Could be populated with dummy data like this:

```
typescript

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


```

