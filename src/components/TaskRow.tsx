'use client'

import React, { useState } from 'react'

interface TaskRowProps {
  id: string
  turno: string
  atividade: string
  onDelete: () => void
  onEdit: (id: string, value: string) => void
  onOpenEditModal: (id: string, turno: string, atividade: string) => void
}

export default function TaskRow({
  id,
  turno,
  atividade,
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

  return (
    <tr data-id={id} className={isRemoving ? 'removing' : ''} onClick={handleRowClick}>
      <td>{turno}</td>
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