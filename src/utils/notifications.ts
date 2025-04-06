export type NotificationType = 'success' | 'error' | 'warning'

export function showNotification(message: string, type: NotificationType): void {
  // Remover notificações anteriores
  const existingNotifications = document.querySelectorAll('.notification')
  existingNotifications.forEach(notification => {
    notification.remove()
  })

  // Criar nova notificação
  const notification = document.createElement('div')
  notification.className = `notification ${type}`

  // Adicionar ícone baseado no tipo
  let icon = '😺'
  if (type === 'error') icon = '😿'
  if (type === 'warning') icon = '😾'

  // Adicionar conteúdo
  notification.innerHTML = `${icon} ${message}`

  // Adicionar ao corpo da página
  document.body.appendChild(notification)

  // Mostrar com animação
  setTimeout(() => {
    notification.classList.add('show')
  }, 10)

  // Remover após alguns segundos
  setTimeout(() => {
    notification.classList.remove('show')
    setTimeout(() => {
      notification.remove()
    }, 300)
  }, 3000)
}