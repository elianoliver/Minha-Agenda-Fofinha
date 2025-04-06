'use client'

import React, { useState } from 'react'
import { getTurnoIcon, getIconFromTime } from './TurnoSelector'

interface TaskRowProps {
  id: string
  turno: string
  atividade: string
  horarioInicio?: string
  horarioFim?: string
  onDelete: () => void
  onEdit: (id: string, value: string) => void
  onOpenEditModal: (id: string, turno: string, atividade: string) => void
}

export default function TaskRow({
  id,
  turno,
  atividade,
  horarioInicio = '',
  horarioFim = '',
  onDelete,
  onEdit,
  onOpenEditModal
}: TaskRowProps) {
  const [isRemoving, setIsRemoving] = useState(false)

  const handleDelete = () => {
    setIsRemoving(true)
    // Temporizador para permitir a animação terminar
    setTimeout(() => {
      onDelete()
    }, 300)
  }

  const handleRowClick = () => {
    onOpenEditModal(id, turno, atividade)
  }

  // Obtém o ícone baseado nos horários, se disponíveis, ou no texto do turno
  const turnoIcon = horarioInicio && horarioFim
    ? getIconFromTime(horarioInicio, horarioFim)
    : getTurnoIcon(turno)

  return (
    <tr data-id={id} className={isRemoving ? 'removing' : ''} onClick={handleRowClick}>
      <td>
        <div className="turno-display">
          <span className="turno-icon">{turnoIcon}</span>
          <span>{turno}</span>
          {horarioInicio && horarioFim && (
            <span className="turno-time">{horarioInicio}-{horarioFim}</span>
          )}
        </div>
      </td>
      <td>{atividade}</td>
      <td className="acoes" onClick={(e) => e.stopPropagation()}>
        <button
          className="delete-btn"
          title="Excluir tarefa"
          onClick={handleDelete}
        >
          🗑️
        </button>
      </td>
    </tr>
  )
}