import React, { useState, useEffect } from 'react'

interface TaskFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (turno: string, atividade: string) => void
  title: string
  initialTurno?: string
  initialAtividade?: string
}

export default function TaskFormModal({
  isOpen,
  onClose,
  onSave,
  title,
  initialTurno = '',
  initialAtividade = ''
}: TaskFormModalProps) {
  const [turno, setTurno] = useState(initialTurno)
  const [atividade, setAtividade] = useState(initialAtividade)

  // Resetar campos quando o modal abrir com novos valores
  useEffect(() => {
    if (isOpen) {
      setTurno(initialTurno)
      setAtividade(initialAtividade)
    }
  }, [isOpen, initialTurno, initialAtividade])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(turno, atividade)
    onClose()
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content task-form-modal">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="turno">Turno</label>
              <input
                type="text"
                id="turno"
                value={turno}
                onChange={(e) => setTurno(e.target.value)}
                placeholder="Ex: Manhã, Tarde, Noite..."
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="atividade">Atividade</label>
              <textarea
                id="atividade"
                value={atividade}
                onChange={(e) => setAtividade(e.target.value)}
                placeholder="Descreva a atividade..."
                rows={4}
                required
              />
            </div>
            <div className="modal-icon">🐱</div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-save">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  )
}