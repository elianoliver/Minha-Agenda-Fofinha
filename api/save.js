const fs = require('fs').promises;
const path = require('path');

module.exports = async (req, res) => {
    const dataFile = path.join(__dirname, '../public/data.json');

    if (req.method === 'POST') {
        // Salvar os dados enviados pelo frontend
        const newData = req.body;
        try {
            await fs.writeFile(dataFile, JSON.stringify(newData, null, 2));
            res.status(200).json({ message: 'Dados salvos com sucesso!' });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao salvar dados', error: error.message });
        }
    } else if (req.method === 'GET') {
        // Retornar os dados salvos
        try {
            const data = await fs.readFile(dataFile, 'utf8');
            res.status(200).json(JSON.parse(data));
        } catch (error) {
            res.status(200).json({}); // Retorna vazio se o arquivo não existir ainda
        }
    } else {
        res.status(405).json({ message: 'Método não permitido' });
    }
};