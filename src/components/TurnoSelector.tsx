import React, { useState, useEffect } from 'react'

interface TurnoSelectorProps {
  value: string
  onChange: (value: string) => void
  horarioInicio?: string
  horarioFim?: string
  onHorarioChange?: (inicio: string, fim: string) => void
}

type TurnoOption = {
  value: string
  label: string
  icon: string
  backgroundColor: string
  horarioPadrao?: { inicio: string; fim: string }
}

// Opções de turno com ícones, cores e horários padrão
const TURNO_OPTIONS: TurnoOption[] = [
  {
    value: 'manhã',
    label: 'Manhã',
    icon: '🌅',
    backgroundColor: '#ffe8cc',
    horarioPadrao: { inicio: '06:00', fim: '12:00' }
  },
  {
    value: 'tarde',
    label: 'Tarde',
    icon: '☀️',
    backgroundColor: '#fff5cc',
    horarioPadrao: { inicio: '12:00', fim: '18:00' }
  },
  {
    value: 'noite',
    label: 'Noite',
    icon: '🌙',
    backgroundColor: '#e0e0ff',
    horarioPadrao: { inicio: '18:00', fim: '23:59' }
  },
  {
    value: 'madrugada',
    label: 'Madrugada',
    icon: '✨',
    backgroundColor: '#d6e0ff',
    horarioPadrao: { inicio: '00:00', fim: '06:00' }
  }
]

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

  // Encontrar a opção selecionada ou usar uma padrão
  const selectedOption = TURNO_OPTIONS.find(
    option => option.value.toLowerCase() === value.toLowerCase()
  ) || {
    value,
    label: value || 'Selecionar turno',
    icon: getIconFromTime(inicio, fim) || '⏰',
    backgroundColor: '#f0f0f0'
  }

  // Atualizar campos de horário quando as props mudarem
  useEffect(() => {
    setInicio(horarioInicio)
    setFim(horarioFim)
  }, [horarioInicio, horarioFim])

  // Função para aplicar horários padrão ao selecionar um turno
  const handleSelectTurno = (option: TurnoOption) => {
    onChange(option.value)

    if (option.horarioPadrao) {
      setInicio(option.horarioPadrao.inicio)
      setFim(option.horarioPadrao.fim)
      onHorarioChange(option.horarioPadrao.inicio, option.horarioPadrao.fim)
    }

    setIsOpen(false)
    setShowTimeFields(true)
  }

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

  return (
    <div className="turno-selector">
      <div
        className="turno-selected"
        onClick={() => setIsOpen(!isOpen)}
        style={{ backgroundColor: selectedOption.backgroundColor }}
      >
        <span className="turno-icon">{selectedOption.icon}</span>
        <span className="turno-label">{selectedOption.label}</span>
        {showTimeFields && inicio && fim && (
          <span className="turno-time">{inicio} - {fim}</span>
        )}
        <span className="turno-arrow">{isOpen ? '▲' : '▼'}</span>
      </div>

      {isOpen && (
        <div className="turno-options">
          {TURNO_OPTIONS.map(option => (
            <div
              key={option.value}
              className={`turno-option ${option.value === selectedOption.value ? 'selected' : ''}`}
              onClick={() => handleSelectTurno(option)}
              style={{ backgroundColor: option.backgroundColor }}
            >
              <span className="turno-icon">{option.icon}</span>
              <span className="turno-label">{option.label}</span>
              {option.horarioPadrao && (
                <span className="turno-time">{option.horarioPadrao.inicio} - {option.horarioPadrao.fim}</span>
              )}
            </div>
          ))}

          {/* Opção para turno personalizado */}
          <div className="turno-custom">
            <input
              type="text"
              placeholder="Outro turno..."
              value={!TURNO_OPTIONS.find(o => o.value === value) ? value : ''}
              onChange={(e) => onChange(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Campos de horário */}
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
                setShowTimeFields(true);
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

// Função para determinar o ícone com base nos horários
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