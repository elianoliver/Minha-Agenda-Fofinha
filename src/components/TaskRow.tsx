'use client'

import React, { useState, useEffect } from 'react'
import { getIconFromTime } from './TurnoSelector'

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
  const [isMobile, setIsMobile] = useState(false)

  // Detectar se está em tela mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    // Verificação inicial
    checkIfMobile()

    // Adicionar listener para redimensionamento
    window.addEventListener('resize', checkIfMobile)

    // Limpar listener
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

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
    : '🕒'; // Usar um ícone padrão quando não há horários

  if (isMobile) {
    // Layout mobile (card)
    return (
      <tr data-id={id} className={`mobile-row ${isRemoving ? 'removing' : ''}`} onClick={handleRowClick}>
        <td colSpan={3}>
          <div className="task-card">
            <div className="task-card-header">
              <div className="turno-container">
                <span className="turno-icon">{turnoIcon}</span>
                {horarioInicio && horarioFim ? (
                  <span className="turno-time">{horarioInicio}-{horarioFim}</span>
                ) : (
                  <span className="turno-label">{turno}</span>
                )}
              </div>
              <div className="task-actions" onClick={(e) => e.stopPropagation()}>
                <button
                  className="delete-btn"
                  aria-label="Excluir tarefa"
                  title="Excluir tarefa"
                  onClick={handleDelete}
                >
                  🗑️
                </button>
              </div>
            </div>
            <div className="task-card-body">
              <div className="atividade-content">{atividade}</div>
            </div>
          </div>
        </td>
      </tr>
    )
  }

  // Layout desktop (tabela normal)
  return (
    <tr data-id={id} className={isRemoving ? 'removing' : ''} onClick={handleRowClick}>
      <td>
        <div className="turno-display">
          <span className="turno-icon">{turnoIcon}</span>
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