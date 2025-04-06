import { createClient } from 'redis'
import { NextResponse } from 'next/server'

// Criar o cliente sem conectar imediatamente
const getRedisClient = async () => {
  // Usar variáveis de ambiente
  const redisUrl = process.env.REDIS_URL
  const redisPassword = process.env.REDIS_PASSWORD

  if (!redisUrl || !redisPassword) {
    throw new Error('Configurações do Redis não encontradas nas variáveis de ambiente')
  }

  const client = createClient({
    url: redisUrl,
    password: redisPassword
  })

  client.on('error', (err) => console.error('Erro no Redis:', err))

  // Conectar o cliente apenas quando necessário
  if (!client.isOpen) {
    await client.connect()
  }

  return client
}

export async function GET() {
  console.log('GET request recebido')

  try {
    // Obter cliente Redis conectado
    const redisClient = await getRedisClient()

    try {
      const data = await redisClient.get('agenda')
      console.log('Dados carregados do Redis:', data)

      // Fechar a conexão depois de usar
      if (redisClient.isOpen) {
        await redisClient.quit()
      }

      return NextResponse.json(data ? JSON.parse(data) : {})
    } catch (error: any) {
      console.error('Erro ao carregar do Redis:', error)

      // Fechar a conexão em caso de erro
      if (redisClient.isOpen) {
        await redisClient.quit()
      }

      return NextResponse.json(
        { message: 'Erro ao carregar dados', error: error.message },
        { status: 500 }
      )
    }
  } catch (connError: any) {
    console.error('Erro ao conectar ao Redis:', connError)
    return NextResponse.json(
      { message: 'Erro ao conectar ao Redis', error: connError.message },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  console.log('POST request recebido')

  try {
    // Obter cliente Redis conectado
    const redisClient = await getRedisClient()

    try {
      const newData = await request.json()
      console.log('Dados recebidos para salvar:', newData)

      await redisClient.set('agenda', JSON.stringify(newData))
      console.log('Dados salvos no Redis com sucesso')

      // Fechar a conexão depois de usar
      if (redisClient.isOpen) {
        await redisClient.quit()
      }

      return NextResponse.json({ message: 'Dados salvos com sucesso!' })
    } catch (error: any) {
      console.error('Erro ao salvar no Redis:', error)

      // Fechar a conexão em caso de erro
      if (redisClient.isOpen) {
        await redisClient.quit()
      }

      return NextResponse.json(
        { message: 'Erro ao salvar dados', error: error.message },
        { status: 500 }
      )
    }
  } catch (connError: any) {
    console.error('Erro ao conectar ao Redis:', connError)
    return NextResponse.json(
      { message: 'Erro ao conectar ao Redis', error: connError.message },
      { status: 500 }
    )
  }
}