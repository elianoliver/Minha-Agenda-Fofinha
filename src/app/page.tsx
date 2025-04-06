'use client'

import { useEffect, useState } from 'react'
import AgendaDay from '../components/AgendaDay'
import { showNotification } from '../utils/notifications'
import DeleteConfirmationModal from '../components/DeleteConfirmationModal'
import TaskFormModal from '../components/TaskFormModal'

type DayData = {
  [key: string]: string
}

type TaskEditInfo = {
  id: string
  turno: string
  atividade: string
  dia: string
  horarioInicio?: string
  horarioFim?: string
} | null

export default function Home() {
  const [data, setData] = useState<DayData>({})
  const [loading, setLoading] = useState(true)

  // Estado para o modal de confirmação de exclusão
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null)

  // Estados para os novos modais
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [taskToEdit, setTaskToEdit] = useState<TaskEditInfo>(null)
  const [dayForNewTask, setDayForNewTask] = useState<string>('')

  // Carregar dados salvos quando a página iniciar
  useEffect(() => {
    loadData()
  }, [])

  // Função para salvar alterações nas atividades
  async function saveChanges() {
    try {
      const response = await fetch("/api/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        showNotification("Alterações salvas com sucesso! 😺", "success")
      } else {
        const result = await response.json()
        showNotification("Erro ao salvar: " + result.message, "error")
      }
    } catch (error: any) {
      showNotification("Erro ao conectar com o servidor: " + error.message, "error")
    }
  }

  // Carregar dados salvos
  async function loadData() {
    setLoading(true)
    try {
      const response = await fetch("/api/save")
      if (!response.ok) {
        throw new Error("Não foi possível carregar os dados")
      }

      const loadedData = await response.json()
      setData(loadedData || {})
    } catch (error: any) {
      console.error("Erro ao carregar dados:", error)
      showNotification("Não foi possível carregar suas tarefas 😿", "error")
    } finally {
      setLoading(false)
    }
  }

  // Abrir modal de confirmação para deletar
  function confirmDelete(rowId: string) {
    setTaskToDelete(rowId)
    setDeleteModalOpen(true)
  }

  // Executar a deleção após confirmação
  function executeDelete() {
    if (!taskToDelete) return

    const newData = { ...data }

    // Remover dados relacionados a esta tarefa
    delete newData[taskToDelete]
    delete newData[`${taskToDelete}-atividade`]
    delete newData[`row_${taskToDelete}`]

    setData(newData)
    showNotification("Tarefa excluída com sucesso! 😸", "success")

    // Salvar alterações após exclusão
    saveChanges()

    // Fechar o modal
    setDeleteModalOpen(false)
    setTaskToDelete(null)
  }

  // Abrir modal para edição de tarefa
  function openEditModal(id: string, turno: string, atividade: string) {
    // Extrair o dia do ID (exemplo: "segunda-123456789")
    const dia = id.split('-')[0]
    const horarioInicio = data[`${id}-horario-inicio`] || ''
    const horarioFim = data[`${id}-horario-fim`] || ''

    setTaskToEdit({
      id,
      turno,
      atividade,
      dia,
      horarioInicio,
      horarioFim
    })
    setEditModalOpen(true)
  }

  // Abrir modal para criação de nova tarefa
  function openCreateModal(dia: string) {
    setDayForNewTask(dia)
    setCreateModalOpen(true)
  }

  // Salvar edição de tarefa
  function saveTaskEdit(turno: string, atividade: string, horarioInicio: string, horarioFim: string) {
    if (!taskToEdit) return

    setData(prev => ({
      ...prev,
      [taskToEdit.id]: turno,
      [`${taskToEdit.id}-atividade`]: atividade,
      [`${taskToEdit.id}-horario-inicio`]: horarioInicio,
      [`${taskToEdit.id}-horario-fim`]: horarioFim
    }))

    showNotification("Tarefa atualizada com sucesso! 😺", "success")
    saveChanges()
  }

  // Criar nova tarefa
  function createNewTask(turno: string, atividade: string, horarioInicio: string, horarioFim: string) {
    if (!dayForNewTask) return

    // Criar novo ID único
    const timestamp = new Date().getTime()
    const rowId = `${dayForNewTask.toLowerCase()}-${timestamp}`

    // Adicionar nova tarefa aos dados
    setData(prev => ({
      ...prev,
      [rowId]: turno,
      [`${rowId}-atividade`]: atividade,
      [`${rowId}-horario-inicio`]: horarioInicio,
      [`${rowId}-horario-fim`]: horarioFim,
      [`row_${rowId}`]: rowId
    }))

    showNotification("Nova tarefa adicionada! 🐱", "success")
    saveChanges()
  }

  // Atualizar dados quando um campo é editado
  function handleEdit(id: string, value: string) {
    setData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  if (loading) {
    return (
      <div className="container">
        <h1>Carregando agenda...</h1>
      </div>
    )
  }

  return (
    <div className="container">
      <h1>Minha Agenda de Gatinhos</h1>

      <AgendaDay
        day="Segunda"
        data={data}
        onDelete={confirmDelete}
        onAdd={() => openCreateModal('segunda')}
        onEdit={handleEdit}
        onOpenEditModal={openEditModal}
      />

      <AgendaDay
        day="Terça"
        data={data}
        onDelete={confirmDelete}
        onAdd={() => openCreateModal('terça')}
        onEdit={handleEdit}
        onOpenEditModal={openEditModal}
      />

      <AgendaDay
        day="Quarta"
        data={data}
        onDelete={confirmDelete}
        onAdd={() => openCreateModal('quarta')}
        onEdit={handleEdit}
        onOpenEditModal={openEditModal}
      />

      <AgendaDay
        day="Quinta"
        data={data}
        onDelete={confirmDelete}
        onAdd={() => openCreateModal('quinta')}
        onEdit={handleEdit}
        onOpenEditModal={openEditModal}
      />

      <AgendaDay
        day="Sexta"
        data={data}
        onDelete={confirmDelete}
        onAdd={() => openCreateModal('sexta')}
        onEdit={handleEdit}
        onOpenEditModal={openEditModal}
      />

      <button className="save-btn" onClick={saveChanges}>
        Salvar Alterações
      </button>

      {/* Modal de confirmação de exclusão */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={executeDelete}
      />

      {/* Modal de edição de tarefa */}
      <TaskFormModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={saveTaskEdit}
        title="Editar Tarefa"
        initialTurno={taskToEdit?.turno || ''}
        initialAtividade={taskToEdit?.atividade || ''}
        initialHorarioInicio={taskToEdit?.horarioInicio || ''}
        initialHorarioFim={taskToEdit?.horarioFim || ''}
      />

      {/* Modal de criação de tarefa */}
      <TaskFormModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={createNewTask}
        title={`Nova Tarefa - ${dayForNewTask.charAt(0).toUpperCase() + dayForNewTask.slice(1)}`}
      />
    </div>
  )
}