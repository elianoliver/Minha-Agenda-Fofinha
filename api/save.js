import { createClient } from 'redis';

// Criar o cliente sem conectar imediatamente
const getRedisClient = async () => {
  const client = createClient({
    url: 'redis://redis-14498.crce181.sa-east-1-2.ec2.redns.redis-cloud.com:14498',
    password: 'HxsvVgFDZXeVsFrDIU90jAkQhAO35eJe'
  });

  client.on('error', (err) => console.error('Erro no Redis:', err));

  // Conectar o cliente apenas quando necessário
  if (!client.isOpen) {
    await client.connect();
  }

  return client;
};

export default async function handler(req, res) {
  console.log('Método recebido:', req.method);

  try {
    // Obter cliente Redis conectado
    const redisClient = await getRedisClient();

    if (req.method === 'POST') {
      const newData = req.body;
      console.log('Dados recebidos para salvar:', newData);

      try {
        await redisClient.set('agenda', JSON.stringify(newData));
        console.log('Dados salvos no Redis com sucesso');
        res.status(200).json({ message: 'Dados salvos com sucesso!' });
      } catch (error) {
        console.error('Erro ao salvar no Redis:', error);
        res.status(500).json({ message: 'Erro ao salvar dados', error: error.message });
      }
    } else if (req.method === 'GET') {
      try {
        const data = await redisClient.get('agenda');
        console.log('Dados carregados do Redis:', data);
        res.status(200).json(data ? JSON.parse(data) : {});
      } catch (error) {
        console.error('Erro ao carregar do Redis:', error);
        res.status(500).json({ message: 'Erro ao carregar dados', error: error.message });
      }
    } else {
      res.status(405).json({ message: 'Método não permitido' });
    }

    // Fechar a conexão depois de usar
    if (redisClient.isOpen) {
      await redisClient.quit();
    }
  } catch (connError) {
    console.error('Erro ao conectar ao Redis:', connError);
    res.status(500).json({ message: 'Erro ao conectar ao Redis', error: connError.message });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};