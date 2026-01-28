module.exports = {
  dialect: 'postgres',
  host: process.env.PGHOST || 'localhost',
  port: process.env.PGPORT || 5432,
  username: process.env.PGUSER || 'anajulia',
  password: process.env.PGPASSWORD || 'postgres',
  database: process.env.PGDATABASE || 'devburguer',
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  },
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};