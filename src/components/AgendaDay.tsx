'use client'

import React from 'react'
import TaskRow from './TaskRow'

interface AgendaDayProps {
  day: string
  data: Record<string, string>
  onDelete: (id: string) => void
  onAdd: () => void
  onEdit: (id: string, value: string) => void
}

export default function AgendaDay({ day, data, onDelete, onAdd, onEdit }: AgendaDayProps) {
  // Encontrar todas as tarefas para este dia
  const getTasksForDay = () => {
    // Procurar todas as entradas que começam com o dia (em minúsculas) seguido por hífen
    const dayPrefix = day.toLowerCase() + '-'
    const rowIds = new Set<string>()

    // Primeiro, encontre todos os IDs de linha para este dia
    Object.keys(data).forEach(key => {
      if (key.startsWith('row_')) {
        const rowId = data[key]
        if (rowId.startsWith(dayPrefix)) {
          rowIds.add(rowId)
        }
      } else if (key.startsWith(dayPrefix) && !key.endsWith('-atividade')) {
        // Também adiciona as tarefas que não têm prefixo 'row_' mas existem diretamente
        rowIds.add(key)
      }
    })

    return Array.from(rowIds)
  }

  const taskIds = getTasksForDay()

  return (
    <>
      <h2>
        {day}
        <button className="add-task" onClick={onAdd}>+ Nova Tarefa</button>
      </h2>
      <table>
        <thead>
          <tr>
            <th>Turno</th>
            <th>Atividade</th>
            <th className="acoes-header">Ações</th>
          </tr>
        </thead>
        <tbody>
          {taskIds.map(rowId => (
            <TaskRow
              key={rowId}
              id={rowId}
              turno={data[rowId] || ''}
              atividade={data[`${rowId}-atividade`] || ''}
              onDelete={() => onDelete(rowId)}
              onEdit={onEdit}
            />
          ))}

          {taskIds.length === 0 && (
            <tr>
              <td colSpan={3} style={{ textAlign: 'center', padding: '20px' }}>
                Sem tarefas para este dia 😸 Adicione uma nova!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  )
}