# jseminck-be-pg

Wrapper around `pg-promise` to simplify the creation of data models and their database interactions.

# Usage instructions

First you need to set up the databse connection during your application startup. You can pass a configuration object which contains your database connection details, but the database will *always* prioritize the `process.env.DATABASE_URL` if it is present, no matter if you provide a config object or not!

```js
import {db} from 'jseminck-be-pg';

db({
   host: 'localhost',
   port: 5432,
   database: 'aws',
   username: 'postgres',
   password: ''
});
```

Once the database object is initialised, you can create models as such:

```js
const UserModel = new PGModel({
    tableName: "users",
    columns: [
        {name: "id", type: "serial"},
        {name: "username", type: "varchar(128)"},
        {name: "password", type: "varchar(128)"},
        {name: "data", type: "jsonb", null: true},
        {name: "created_at", type: "timestamp", default: "CURRENT_TIMESTAMP"},
        {name: "last_login", type: "timestamp", null: true}
    ]
});
```

The current API is limited, but it allows to:

### findOne

Find one entry

```js
UserModel.findOne({column: "username", value: username});
```

### update

Update an entry

```js
UserModel.update({
    column: "last_login",
    value: "current_timestamp",
    where: {column: "username", value: username}
});
```

### create

Create an entry

```js
UserModel.create({
    username: "myUser",
    password: "myPassword",
    data: {modules: {}}
});
```

### remove

Remove an entry

```js
UserModel.remove({column: "username", value: username});
```

### recreate

Drop and recreate the users table. This will remove all data!

```js
UserModel.__recreate()
```