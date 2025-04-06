import React, { useState, useEffect } from 'react'

interface TurnoSelectorProps {
  value: string
  onChange: (value: string) => void
  horarioInicio?: string
  horarioFim?: string
  onHorarioChange?: (inicio: string, fim: string) => void
}

export default function TurnoSelector({
  value,
  onChange,
  horarioInicio = '',
  horarioFim = '',
  onHorarioChange = () => {}
}: TurnoSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showTimeFields, setShowTimeFields] = useState(false)
  const [inicio, setInicio] = useState(horarioInicio)
  const [fim, setFim] = useState(horarioFim)

  // Atualizar campos de horário quando as props mudarem
  useEffect(() => {
    setInicio(horarioInicio)
    setFim(horarioFim)
  }, [horarioInicio, horarioFim])

  // Atualizar horários quando os campos mudam
  const handleHorarioChange = (tipo: 'inicio' | 'fim', value: string) => {
    if (tipo === 'inicio') {
      setInicio(value)
      onHorarioChange(value, fim)
    } else {
      setFim(value)
      onHorarioChange(inicio, value)
    }
  }

  const icon = getIconFromTime(inicio, fim) || '⏰';

  return (
    <div className="turno-selector">
      <div
        className="turno-selected"
        onClick={() => setIsOpen(!isOpen)}
        style={{ backgroundColor: '#f0f0f0' }}
      >
        <span className="turno-icon">{icon}</span>
        {inicio && fim ? (
          <span className="turno-time">{inicio} - {fim}</span>
        ) : (
          <span className="turno-placeholder">Selecione horários</span>
        )}
        <span className="turno-arrow">{isOpen ? '▲' : '▼'}</span>
      </div>

      {isOpen && (
        <div className="turno-options" style={{ maxHeight: '200px', overflow: 'auto' }}>
          <div className="turno-horarios">
            <div className="horario-group">
              <label>Início:</label>
              <input
                type="time"
                value={inicio}
                onChange={(e) => handleHorarioChange('inicio', e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="horario-group">
              <label>Fim:</label>
              <input
                type="time"
                value={fim}
                onChange={(e) => handleHorarioChange('fim', e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <button
              className="horario-apply"
              onClick={(e) => {
                e.stopPropagation();
                onChange(`${inicio} - ${fim}`); // Atualiza o valor usando os horários
                setIsOpen(false);
              }}
            >
              Aplicar Horários
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Manter as funções auxiliares para determinar ícones
export function getIconFromTime(inicio?: string, fim?: string): string {
  if (!inicio || !fim) return '🕒';

  // Converter horários para minutos desde meia-noite para facilitar comparação
  const inicioMinutos = convertTimeToMinutes(inicio);
  const fimMinutos = convertTimeToMinutes(fim);

  // Calcular o horário médio
  let horarioMedio = (inicioMinutos + fimMinutos) / 2;

  // Ajustar cálculo para períodos que cruzam meia-noite
  if (fimMinutos < inicioMinutos) {
    if (fimMinutos + 1440 - inicioMinutos > 720) {
      // Se o período for muito longo, usar o início
      horarioMedio = inicioMinutos;
    } else {
      // Adicionar 24h ao fim para cálculo
      horarioMedio = (inicioMinutos + (fimMinutos + 1440)) / 2;
      if (horarioMedio >= 1440) horarioMedio -= 1440;
    }
  }

  // Determinar período com base no horário médio
  if (horarioMedio >= 0 && horarioMedio < 360) return '✨'; // Madrugada (00:00-06:00)
  if (horarioMedio >= 360 && horarioMedio < 720) return '🌅'; // Manhã (06:00-12:00)
  if (horarioMedio >= 720 && horarioMedio < 1080) return '☀️'; // Tarde (12:00-18:00)
  return '🌙'; // Noite (18:00-00:00)
}

// Função de utilidade para obter o ícone para um turno específico (texto)
export function getTurnoIcon(turno: string, inicio?: string, fim?: string): string {
  // Se tiver horários definidos, usar esses para determinar o ícone
  if (inicio && fim) {
    return getIconFromTime(inicio, fim);
  }

  // Caso contrário, usar o texto do turno
  const normalizedTurno = turno.toLowerCase().trim()

  if (normalizedTurno.includes('manhã') || normalizedTurno.includes('manha')) return '🌅'
  if (normalizedTurno.includes('tarde')) return '☀️'
  if (normalizedTurno.includes('noite')) return '🌙'
  if (normalizedTurno.includes('madrugada')) return '✨'

  return '🕒' // Ícone padrão para outros turnos
}

// Função auxiliar para converter horário (HH:MM) para minutos desde meia-noite
function convertTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}