'use client'

import React, { useState, useRef, useEffect } from 'react'

interface TaskRowProps {
  id: string
  turno: string
  atividade: string
  onDelete: () => void
  onEdit: (id: string, value: string) => void
}

export default function TaskRow({ id, turno, atividade, onDelete, onEdit }: TaskRowProps) {
  const [isRemoving, setIsRemoving] = useState(false)
  const turnoRef = useRef<HTMLTableCellElement>(null)
  const atividadeRef = useRef<HTMLTableCellElement>(null)

  const handleBlur = (e: React.FocusEvent<HTMLTableCellElement>, fieldId: string) => {
    onEdit(fieldId, e.target.innerText)
  }

  const handleDelete = () => {
    setIsRemoving(true)
    // Temporizador para permitir a animação terminar
    setTimeout(() => {
      onDelete()
    }, 300)
  }

  return (
    <tr data-id={id} className={isRemoving ? 'removing' : ''}>
      <td
        ref={turnoRef}
        contentEditable={true}
        suppressContentEditableWarning={true}
        onBlur={(e) => handleBlur(e, id)}
      >
        {turno}
      </td>
      <td
        ref={atividadeRef}
        contentEditable={true}
        suppressContentEditableWarning={true}
        onBlur={(e) => handleBlur(e, `${id}-atividade`)}
      >
        {atividade}
      </td>
      <td className="acoes">
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