const { Client } = require('pg')
// var pg = require('pg')

const cn = new Client ({
  host: 'localhost',
  port: 5432,
  database: 'retail',
  user: 'postgres',
  password: 'bread'
});

// const db = pgp(cn);
cn.connect(() => {
  console.log('Connected to postgres database')
})

module.exports = cn;

