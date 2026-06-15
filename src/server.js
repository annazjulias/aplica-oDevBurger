require('dotenv').config() // deve ser a primeira linha
import app from './app.js';
import 'dotenv/config';

const PORT = process.env.PORT ;

app.listen(PORT, () => {
  console.log(`🔥 Server rodando na porta ${PORT}`);
});
