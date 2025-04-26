# Dockerfile

# Imagem base do Node.js
FROM node:18

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia package.json e package-lock.json e instala dependências
COPY package*.json ./
RUN npm install

# Copia todo o código-fonte da aplicação
COPY . .

# Compila o TypeScript para JavaScript (gera a pasta dist)
RUN npm run build

# Exponha a porta que o app irá escutar
EXPOSE 3000

# Comando padrão para iniciar a aplicação em modo produção
CMD ["npm", "run", "start:prod"]
