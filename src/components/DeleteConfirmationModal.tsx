import React from 'react'

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  itemName?: string
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  itemName = 'tarefa'
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Confirmar exclusão</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="modal-icon">🙀</div>
          <p>Tem certeza que deseja excluir esta {itemName}?</p>
          <p className="modal-warning">Esta ação não pode ser desfeita.</p>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancelar</button>
          <button className="btn-delete" onClick={onConfirm}>Excluir</button>
        </div>
      </div>
    </div>
  )
}