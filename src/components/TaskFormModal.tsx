import React, { useState, useEffect } from 'react'
import TurnoSelector from './TurnoSelector'

interface TaskFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (turno: string, atividade: string, horarioInicio: string, horarioFim: string) => void
  title: string
  initialTurno?: string
  initialAtividade?: string
  initialHorarioInicio?: string
  initialHorarioFim?: string
}

export default function TaskFormModal({
  isOpen,
  onClose,
  onSave,
  title,
  initialTurno = '',
  initialAtividade = '',
  initialHorarioInicio = '',
  initialHorarioFim = ''
}: TaskFormModalProps) {
  const [turno, setTurno] = useState(initialTurno)
  const [atividade, setAtividade] = useState(initialAtividade)
  const [horarioInicio, setHorarioInicio] = useState(initialHorarioInicio)
  const [horarioFim, setHorarioFim] = useState(initialHorarioFim)

  // Resetar campos quando o modal abrir com novos valores
  useEffect(() => {
    if (isOpen) {
      setTurno(initialTurno)
      setAtividade(initialAtividade)
      setHorarioInicio(initialHorarioInicio)
      setHorarioFim(initialHorarioFim)
    }
  }, [isOpen, initialTurno, initialAtividade, initialHorarioInicio, initialHorarioFim])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(turno, atividade, horarioInicio, horarioFim)
    onClose()
  }

  const handleHorarioChange = (inicio: string, fim: string) => {
    setHorarioInicio(inicio)
    setHorarioFim(fim)
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
              <label htmlFor="turno">Turno e Horário</label>
              <TurnoSelector
                value={turno}
                onChange={setTurno}
                horarioInicio={horarioInicio}
                horarioFim={horarioFim}
                onHorarioChange={handleHorarioChange}
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