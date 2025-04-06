# Agenda de Gatinhos

Aplicativo web para gerenciamento de agenda com tema de gatinhos, desenvolvido com Next.js e otimizado como PWA (Progressive Web App) para uso em dispositivos móveis.

## Tecnologias Utilizadas

- **Next.js**: Framework React para renderização do lado do servidor
- **TypeScript**: Tipagem estática para JavaScript
- **Redis**: Banco de dados para armazenamento das informações
- **PWA**: Progressive Web App para experiência mobile
- **Vercel**: Plataforma para hospedagem e deploy

## Configuração do Ambiente

1. Clone o repositório
2. Instale as dependências:
   ```
   npm install
   ```
3. Crie um arquivo `.env.local` com as seguintes variáveis:
   ```
   REDIS_URL=sua-url-do-redis
   REDIS_PASSWORD=sua-senha-do-redis
   ```
4. Execute o servidor de desenvolvimento:
   ```
   npm run dev
   ```

## Deploy na Vercel

Para fazer o deploy na Vercel:

1. Crie uma conta na [Vercel](https://vercel.com)
2. Conecte seu repositório GitHub
3. Configure as variáveis de ambiente:
   - `REDIS_URL`: URL de conexão do Redis
   - `REDIS_PASSWORD`: Senha do Redis
4. Faça o deploy do projeto

## Funcionalidades

- Visualização e edição de tarefas por dia da semana
- Adição e remoção de tarefas
- Salvamento automático das alterações
- Funciona offline após primeiro carregamento (PWA)
- Interface responsiva para celulares e tablets

## Licença

ISC