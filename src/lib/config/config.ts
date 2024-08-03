export const config = {
    connString: process.env['MONGO_CONN_STRING'] || 'mongodb://127.0.0.1:27017/action-items',

    password: process.env['AUTH_PASSWORD'] || 'secret',

    // generate using: crypto.randomBytes(64).toString('hex');
    jwtSecret: process.env['JWT_SECRET'] || '7ce4d0a91b94cf9ac127a3a1564b2ffa61acd0ee7bb37e38bb26f5e60d6afb4f82c5631d955e80b617a5002dba13ed91ab47b6a9d3ac96c12f91db26cc68396d',
}