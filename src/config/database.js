module.exports = {
  dialect: 'postgres',
  host: 'localhost', // host do container mapeado
  port: 5432,
  username: 'postgres',
  password: 'postgres', // senha que você definiu no container
  database: 'devburger', // nome do banco

  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
