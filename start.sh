#!/bin/sh

echo "🚀 Iniciando aplicação DevBurger..."

# Aguardar banco de dados estar pronto
echo "⏳ Aguardando PostgreSQL..."
until nc -z ${PGHOST:-localhost} ${PGPORT:-5432}; do
  sleep 1
done
echo "✅ PostgreSQL pronto!"

# Executar migrations
echo "🔄 Executando migrations..."
npx sequelize-cli db:migrate

# Iniciar aplicação
echo "✨ Iniciando servidor..."
yarn start