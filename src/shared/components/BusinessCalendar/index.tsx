import React, { useState, useMemo, useCallback } from "react";
import { Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./styles.module.css";
import { Button } from "../Button";

interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isAvailable: boolean;
}

interface BusinessCalendarProps {
  onDateTimeSelect?: (dateTime: Date) => void;
  selectedDateTime?: Date | null;
  className?: string;
  minAdvanceHours?: number; // Horas mínimas de antecedência (padrão: 24)
  businessHours?: {
    start: number; // Hora de início (padrão: 8)
    end: number; // Hora de fim (padrão: 17)
  };
  excludedDates?: Date[]; // Datas específicas para excluir
  locale?: string; // Idioma (padrão: 'pt-BR')
}

// Constantes
const DEFAULT_BUSINESS_HOURS = {
  start: 8,
  end: 17,
};

const MONTH_NAMES_PT = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const DAY_NAMES_PT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export const BusinessCalendar: React.FC<BusinessCalendarProps> = ({
  onDateTimeSelect,
  className = "",
  minAdvanceHours = 24,
  businessHours = DEFAULT_BUSINESS_HOURS,
  excludedDates = [],
  locale = "pt-BR",
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Funções de validação
  const isWeekday = useCallback((date: Date): boolean => {
    const dayOfWeek = date.getDay();
    return dayOfWeek >= 1 && dayOfWeek <= 5; // Segunda a sexta
  }, []);

  const isBusinessHour = useCallback(
    (hour: number): boolean => {
      return hour >= businessHours.start && hour <= businessHours.end;
    },
    [businessHours]
  );

  const isExcludedDate = useCallback(
    (date: Date): boolean => {
      return excludedDates.some(
        (excludedDate) => excludedDate.toDateString() === date.toDateString()
      );
    },
    [excludedDates]
  );

  const isValidDate = useCallback(
    (date: Date): boolean => {
      const now = new Date();
      const minDateTime = new Date(
        now.getTime() + minAdvanceHours * 60 * 60 * 1000
      );

      // Remove horas para comparação apenas de data
      const dateOnly = new Date(date);
      dateOnly.setHours(0, 0, 0, 0);

      const minDateOnly = new Date(minDateTime);
      minDateOnly.setHours(0, 0, 0, 0);

      return (
        dateOnly >= minDateOnly && isWeekday(date) && !isExcludedDate(date)
      );
    },
    [minAdvanceHours, isWeekday, isExcludedDate]
  );

  // Gerar horários comerciais
  const businessHoursArray = useMemo((): string[] => {
    const hours: string[] = [];
    for (let hour = businessHours.start; hour <= businessHours.end; hour++) {
      hours.push(`${hour.toString().padStart(2, "0")}:00`);
    }
    return hours;
  }, [businessHours]);

  // Gerar dias do calendário
  const generateCalendarDays = useCallback((): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const isCurrentMonth = date.getMonth() === month;
      const isToday = date.getTime() === today.getTime();
      const isAvailable = isCurrentMonth && isValidDate(date);

      days.push({
        date: new Date(date),
        day: date.getDate(),
        isCurrentMonth,
        isToday,
        isAvailable,
      });
    }

    return days;
  }, [currentDate, isValidDate]);

  const calendarDays = useMemo(
    () => generateCalendarDays(),
    [generateCalendarDays]
  );

  // Handlers
  const handlePreviousMonth = useCallback((): void => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
    setSelectedDate(null);
    setSelectedTime(null);
  }, [currentDate]);

  const handleNextMonth = useCallback((): void => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
    setSelectedDate(null);
    setSelectedTime(null);
  }, [currentDate]);

  const handleDateSelect = useCallback((day: CalendarDay): void => {
    if (!day.isAvailable) return;

    setSelectedDate(day.date);
    setSelectedTime(null);
  }, []);

  const handleTimeSelect = useCallback(
    (time: string): void => {
      if (!selectedDate) return;

      setSelectedTime(time);

      const [hours, minutes] = time.split(":").map(Number);
      const dateTime = new Date(selectedDate);
      dateTime.setHours(hours, minutes, 0, 0);

      // Validação adicional para garantir que o horário ainda é válido
      const now = new Date();
      const minDateTime = new Date(
        now.getTime() + minAdvanceHours * 60 * 60 * 1000
      );

      if (dateTime >= minDateTime && isBusinessHour(hours)) {
        onDateTimeSelect?.(dateTime);
      }
    },
    [selectedDate, minAdvanceHours, isBusinessHour, onDateTimeSelect]
  );

  // Função para obter classes CSS do dia
  const getDayClassName = useCallback(
    (day: CalendarDay): string => {
      const classes: string[] = [styles.dayCell];

      if (!day.isCurrentMonth) {
        classes.push(styles.dayUnavailable);
      } else if (day.isToday) {
        classes.push(styles.dayToday);
      } else if (day.isAvailable) {
        classes.push(styles.dayAvailable);
      } else {
        classes.push(styles.dayUnavailable);
      }

      if (selectedDate && day.date.getTime() === selectedDate.getTime()) {
        classes.push(styles.daySelected);
      }

      return classes.join(" ");
    },
    [selectedDate]
  );

  // Formatar data/hora selecionada
  const formatSelectedDateTime = useCallback((): string | null => {
    if (!selectedDate || !selectedTime) return null;

    const [hours] = selectedTime.split(":").map(Number);
    const dateTime = new Date(selectedDate);
    dateTime.setHours(hours, 0, 0, 0);

    return dateTime.toLocaleDateString(locale, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [selectedDate, selectedTime, locale]);

  // Verificar se um horário específico está disponível
  const isTimeSlotAvailable = useCallback(
    (time: string): boolean => {
      if (!selectedDate) return false;

      const [hours] = time.split(":").map(Number);
      const dateTime = new Date(selectedDate);
      dateTime.setHours(hours, 0, 0, 0);

      const now = new Date();
      const minDateTime = new Date(
        now.getTime() + minAdvanceHours * 60 * 60 * 1000
      );

      return dateTime >= minDateTime && isBusinessHour(hours);
    },
    [selectedDate, minAdvanceHours, isBusinessHour]
  );

  return (
    <div className={`${styles.container} ${className}`}>
      {/* Header */}
      <div className={styles.header}>
        <Button
          className={styles.navButton}
          onClick={handlePreviousMonth}
          type="button"
          aria-label="Mês anterior"
        >
          <ChevronLeft size={20} />
        </Button>

        <div className={styles.headerTitle}>
          <Calendar size={20} />
          {MONTH_NAMES_PT[currentDate.getMonth()]} {currentDate.getFullYear()}
        </div>

        <Button
          className={styles.navButton}
          onClick={handleNextMonth}
          type="button"
          aria-label="Próximo mês"
        >
          <ChevronRight size={20} />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className={styles.calendarGrid}>
        {/* Day headers */}
        {DAY_NAMES_PT.map((day) => (
          <div key={day} className={styles.dayHeader}>
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={getDayClassName(day)}
            onClick={() => handleDateSelect(day)}
            role="button"
            tabIndex={day.isAvailable ? 0 : -1}
            aria-label={`${day.day} de ${
              MONTH_NAMES_PT[currentDate.getMonth()]
            }`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleDateSelect(day);
              }
            }}
          >
            {day.day}
          </div>
        ))}
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div className={styles.timeSlots}>
          <div className={styles.timeSlotsTitle}>
            <Clock size={16} />
            Horários Disponíveis ({businessHours.start}h às {businessHours.end}
            h)
          </div>

          {businessHoursArray.length > 0 ? (
            <div className={styles.timeGrid}>
              {businessHoursArray.map((time) => {
                const isAvailable = isTimeSlotAvailable(time);
                const isSelected = selectedTime === time;

                return (
                  <Button
                    key={time}
                    className={`${styles.timeSlot} ${
                      isSelected ? styles.timeSlotSelected : ""
                    } ${!isAvailable ? styles.timeSlotUnavailable || "" : ""}`}
                    onClick={() => handleTimeSelect(time)}
                    disabled={!isAvailable}
                    type="button"
                    aria-label={`Horário ${time}`}
                  >
                    {time}
                  </Button>
                );
              })}
            </div>
          ) : (
            <div className={styles.noTimeSlots}>
              Nenhum horário disponível para esta data
            </div>
          )}
        </div>
      )}

      {/* Selected DateTime Display */}
      {selectedDate && selectedTime && (
        <div className={styles.selectedDateTime}>
          <div className={styles.selectedDateTimeText}>
            📅 Agendamento selecionado:
            <br />
            <strong>{formatSelectedDateTime()}</strong>
          </div>
        </div>
      )}
    </div>
  );
};
