const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',  
  password: 'MiPassw0rd!2025',  
  database: 'Like_me_l',
  port: 5432,
  allowExitOnIdle: true,
});

module.exports = pool;