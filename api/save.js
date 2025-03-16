import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        // Salvar os dados enviados pelo frontend
        const newData = req.body;
        try {
            await kv.set('agenda', JSON.stringify(newData));
            res.status(200).json({ message: 'Dados salvos com sucesso!' });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao salvar dados', error: error.message });
        }
    } else if (req.method === 'GET') {
        // Retornar os dados salvos
        try {
            const data = await kv.get('agenda');
            res.status(200).json(data ? JSON.parse(data) : {});
        } catch (error) {
            res.status(500).json({ message: 'Erro ao carregar dados', error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Método não permitido' });
    }
}