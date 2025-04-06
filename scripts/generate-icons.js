const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Diretório dos arquivos
const publicDir = path.join(__dirname, '../public');

// Configurações de ícones
const icons = [
  { input: 'icon-192x192.svg', output: 'icon-192x192.png', size: 192 },
  { input: 'icon-512x512.svg', output: 'icon-512x512.png', size: 512 },
  { input: 'icon-192x192.svg', output: 'apple-touch-icon.png', size: 180 }
];

async function generateIcons() {
  console.log('Gerando ícones para PWA...');

  for (const icon of icons) {
    const inputPath = path.join(publicDir, icon.input);
    const outputPath = path.join(publicDir, icon.output);

    try {
      await sharp(inputPath)
        .resize(icon.size, icon.size)
        .png()
        .toFile(outputPath);

      console.log(`✅ Gerado: ${icon.output}`);
    } catch (error) {
      console.error(`❌ Erro ao gerar ${icon.output}:`, error.message);
    }
  }

  console.log('Processo de geração de ícones concluído!');
}