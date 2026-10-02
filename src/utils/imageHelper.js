/**
 * Converte e otimiza um arquivo de imagem local para Base64 (Data URL).
 * Redimensiona e comprime para evitar estourar o limite de armazenamento local ou payload.
 *
 * @param {File} file - Arquivo selecionado no input
 * @param {Object} options - Configurações de redimensionamento
 * @param {number} options.maxWidth - Largura máxima (default: 800)
 * @param {number} options.maxHeight - Altura máxima (default: 800)
 * @param {number} options.quality - Qualidade JPEG (0.1 a 1.0, default: 0.8)
 * @returns {Promise<string>} Data URL da imagem otimizada
 */
export function compressImage(file, { maxWidth = 800, maxHeight = 800, quality = 0.8 } = {}) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('O arquivo selecionado não é uma imagem válida.'))
    }

    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Erro ao ler o arquivo de imagem.'))

    reader.onload = (event) => {
      const img = new Image()
      img.onerror = () => reject(new Error('Erro ao carregar a imagem.'))

      img.onload = () => {
        let width = img.width
        let height = img.height

        // Calcula novas dimensões mantendo aspect ratio
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        }

        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height)
          height = maxHeight
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality)
        resolve(compressedDataUrl)
      }

      img.src = event.target.result
    }

    reader.readAsDataURL(file)
  })
}
