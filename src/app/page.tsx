'use client'

import { useEffect, useState } from 'react'
import AgendaDay from '../components/AgendaDay'
import { showNotification } from '../utils/notifications'

type DayData = {
  [key: string]: string
}

export default function Home() {
  const [data, setData] = useState<DayData>({})
  const [loading, setLoading] = useState(true)

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

  // Deletar tarefa
  function deleteTask(rowId: string) {
    // Confirmar exclusão
    if (confirm("Tem certeza que deseja excluir esta tarefa? 🙀")) {
      const newData = { ...data }

      // Remover dados relacionados a esta tarefa
      delete newData[rowId]
      delete newData[`${rowId}-atividade`]
      delete newData[`row_${rowId}`]

      setData(newData)
      showNotification("Tarefa excluída com sucesso! 😸", "success")

      // Salvar alterações após exclusão
      saveChanges()
    }
  }

  // Atualizar dados quando um campo é editado
  function handleEdit(id: string, value: string) {
    setData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  // Adicionar nova tarefa
  function addTask(dia: string) {
    // Criar novo ID único
    const timestamp = new Date().getTime()
    const rowId = `${dia.toLowerCase()}-${timestamp}`

    // Adicionar nova tarefa aos dados
    setData(prev => ({
      ...prev,
      [rowId]: 'Novo turno',
      [`${rowId}-atividade`]: 'Nova atividade',
      [`row_${rowId}`]: rowId
    }))

    showNotification("Nova tarefa adicionada! 🐱", "success")

    // Salvar alterações após adicionar
    saveChanges()
  }

  if (loading) {
    return (
      <div className="container">
        <h1>Carregando agenda...</h1>
        <div style={{ textAlign: 'center', fontSize: '2rem' }}>🐱</div>
      </div>
    )
  }

  return (
    <div className="container">
      <h1>Minha Agenda de Gatinhos</h1>

      <AgendaDay
        day="Segunda"
        data={data}
        onDelete={deleteTask}
        onAdd={() => addTask('Segunda')}
        onEdit={handleEdit}
      />

      <AgendaDay
        day="Terça"
        data={data}
        onDelete={deleteTask}
        onAdd={() => addTask('Terça')}
        onEdit={handleEdit}
      />

      <AgendaDay
        day="Quarta"
        data={data}
        onDelete={deleteTask}
        onAdd={() => addTask('Quarta')}
        onEdit={handleEdit}
      />

      <AgendaDay
        day="Quinta"
        data={data}
        onDelete={deleteTask}
        onAdd={() => addTask('Quinta')}
        onEdit={handleEdit}
      />

      <AgendaDay
        day="Sexta"
        data={data}
        onDelete={deleteTask}
        onAdd={() => addTask('Sexta')}
        onEdit={handleEdit}
      />

      <button className="save-btn" onClick={saveChanges}>
        Salvar Alterações
      </button>
    </div>
  )
}