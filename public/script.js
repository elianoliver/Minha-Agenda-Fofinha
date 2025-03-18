/**
 * Agenda Fofinha - Funções para gerenciar tarefas
 */

// Carrega os dados salvos quando a página iniciar
document.addEventListener('DOMContentLoaded', loadData);

// Função para salvar alterações nas atividades existentes
async function saveChanges() {
  const data = {};

  // Capturar todos os dados editáveis (turnos e atividades)
  document.querySelectorAll("td[contenteditable]").forEach((td) => {
    data[td.id] = td.innerText;
  });

  // Também armazena os IDs das linhas para não perder as novas tarefas adicionadas
  document.querySelectorAll("tr[data-id]").forEach((tr) => {
    const rowId = tr.getAttribute('data-id');
    data[`row_${rowId}`] = rowId; // Marca como existente
  });

  try {
    const response = await fetch("/api/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (response.ok) {
      showNotification("Alterações salvas com sucesso! 😺", "success");
    } else {
      showNotification("Erro ao salvar: " + result.message, "error");
    }
  } catch (error) {
    showNotification("Erro ao conectar com o servidor: " + error.message, "error");
  }
}

// Carregar dados salvos
async function loadData() {
  try {
    const response = await fetch("/api/save");
    if (!response.ok) {
      throw new Error("Não foi possível carregar os dados");
    }

    const data = await response.json();

    // Primeiro, carregue as linhas existentes
    for (const [id, value] of Object.entries(data)) {
      const td = document.getElementById(id);
      if (td) td.innerText = value;
    }

    // Em seguida, verifique se há novas linhas para criar
    const existingRows = {};
    document.querySelectorAll('tr[data-id]').forEach(tr => {
      existingRows[tr.getAttribute('data-id')] = true;
    });

    // Recria as linhas que existem no banco mas não estão no DOM
    for (const [key, rowId] of Object.entries(data)) {
      if (key.startsWith('row_') && !existingRows[rowId]) {
        // Extrair o dia da semana do ID (assumindo formato 'dia-timestamp')
        const dayMatch = rowId.match(/^([^-]+)-/);
        if (dayMatch) {
          const day = dayMatch[1];
          // Capitalize first letter
          const dayCapitalized = day.charAt(0).toUpperCase() + day.slice(1);
          // Encontrar a tabela para este dia
          recreateTask(dayCapitalized, rowId, data);
        }
      }
    }
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
    showNotification("Não foi possível carregar suas tarefas 😿", "error");
  }
}

// Recriar uma tarefa a partir dos dados carregados
function recreateTask(dia, rowId, data) {
  // Encontrar a tabela correspondente ao dia
  const tables = document.querySelectorAll('h2');
  let table = null;

  for (let i = 0; i < tables.length; i++) {
    if (tables[i].textContent.includes(dia)) {
      table = tables[i].nextElementSibling;
      while (table && table.tagName !== 'TABLE') {
        table = table.nextElementSibling;
      }
      break;
    }
  }

  if (!table) return;

  // Criar elementos da nova linha
  const newRow = document.createElement('tr');
  newRow.setAttribute('data-id', rowId);

  // Coluna do turno
  const turnoCell = document.createElement('td');
  turnoCell.setAttribute('contenteditable', 'true');
  turnoCell.id = `${rowId}`;
  turnoCell.innerText = data[`${rowId}`] || 'Novo turno';

  // Coluna da atividade
  const atividadeCell = document.createElement('td');
  atividadeCell.setAttribute('contenteditable', 'true');
  atividadeCell.id = `${rowId}-atividade`;
  atividadeCell.innerText = data[`${rowId}-atividade`] || 'Nova atividade';

  // Coluna de ações
  const acaoCell = document.createElement('td');
  acaoCell.className = 'acoes';

  // Botão de excluir
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.innerHTML = '🗑️';
  deleteBtn.setAttribute('title', 'Excluir tarefa');
  deleteBtn.onclick = function() { deleteTask(rowId); };

  // Adicionar elementos à linha
  acaoCell.appendChild(deleteBtn);
  newRow.appendChild(turnoCell);
  newRow.appendChild(atividadeCell);
  newRow.appendChild(acaoCell);

  // Adicionar a linha à tabela
  table.appendChild(newRow);
}

// Adicionar nova tarefa
function addTask(dia) {
  // Encontrar a tabela correspondente ao dia
  const tables = document.querySelectorAll('h2');
  let table = null;

  for (let i = 0; i < tables.length; i++) {
    if (tables[i].textContent.includes(dia)) {
      table = tables[i].nextElementSibling;
      while (table && table.tagName !== 'TABLE') {
        table = table.nextElementSibling;
      }
      break;
    }
  }

  if (!table) {
    showNotification(`Não foi possível encontrar a tabela para ${dia}`, "error");
    return;
  }

  // Criar novo ID único
  const timestamp = new Date().getTime();
  const rowId = `${dia.toLowerCase()}-${timestamp}`;

  // Criar elementos da nova linha
  const newRow = document.createElement('tr');
  newRow.setAttribute('data-id', rowId);

  // Coluna do turno
  const turnoCell = document.createElement('td');
  turnoCell.setAttribute('contenteditable', 'true');
  turnoCell.id = `${rowId}`;
  turnoCell.innerText = 'Novo turno';

  // Coluna da atividade
  const atividadeCell = document.createElement('td');
  atividadeCell.setAttribute('contenteditable', 'true');
  atividadeCell.id = `${rowId}-atividade`;
  atividadeCell.innerText = 'Nova atividade';

  // Coluna de ações
  const acaoCell = document.createElement('td');
  acaoCell.className = 'acoes';

  // Botão de excluir
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.innerHTML = '🗑️';
  deleteBtn.setAttribute('title', 'Excluir tarefa');
  deleteBtn.onclick = function() { deleteTask(rowId); };

  // Adicionar elementos à linha
  acaoCell.appendChild(deleteBtn);
  newRow.appendChild(turnoCell);
  newRow.appendChild(atividadeCell);
  newRow.appendChild(acaoCell);

  // Adicionar a linha à tabela
  table.appendChild(newRow);

  // Foco no novo item
  turnoCell.focus();

  // Salvar a nova tarefa
  saveChanges();

  showNotification("Nova tarefa adicionada! 🐱", "success");
}

// Deletar tarefa
function deleteTask(rowId) {
  const row = document.querySelector(`tr[data-id="${rowId}"]`);
  if (!row) {
    showNotification("Não foi possível encontrar a tarefa para excluir", "error");
    return;
  }

  // Confirmar exclusão
  if (confirm("Tem certeza que deseja excluir esta tarefa? 🙀")) {
    row.classList.add('removing');

    // Animação de fade out antes de remover
    setTimeout(() => {
      row.remove();
      showNotification("Tarefa excluída com sucesso! 😸", "success");

      // Em vez de usar um endpoint separado, salvamos o estado atual
      // que não incluirá mais a linha removida
      saveChanges();
    }, 300);
  }
}

// Mostrar notificações estilizadas
function showNotification(message, type) {
  // Remover notificações anteriores
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(notification => {
    notification.remove();
  });

  // Criar nova notificação
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;

  // Adicionar ícone baseado no tipo
  let icon = '😺';
  if (type === 'error') icon = '😿';
  if (type === 'warning') icon = '😾';

  notification.innerHTML = `${icon} ${message}`;

  // Adicionar ao DOM
  document.body.appendChild(notification);

  // Animar entrada
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);

  // Remover após alguns segundos
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}