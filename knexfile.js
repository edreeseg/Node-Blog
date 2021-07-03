module.exports = {
  development: {
    client: 'sqlite3',
    connection: { filename: './data/lambda.sqlite3' },
    pool: {
      // This is necessary as FK constraint is off by default with SQLite3.
      afterCreate: function(conn, cb) {
        conn.run('PRAGMA foreign_keys = ON', cb);
      },
    },
    useNullAsDefault: true,
    migrations: {
      directory: './data/migrations',
      tableName: 'dbmigrations',
    },
    seeds: { directory: './data/seeds' },
  },
};
