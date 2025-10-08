import { useState } from "react";

interface Props {
  onScheduleChange?: (isoDate: string | null) => void; //para pasar la fecha y hora al flujo de publicación
}

export default function PublishOptions({ onScheduleChange }: Props) {
  const [date, setDate] = useState("2025-12-24");
  const [time, setTime] = useState("10:30");
  const [isScheduled, setIsScheduled] = useState(false);

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const schedule = e.target.value === "schedule";
    setIsScheduled(schedule);

    if (!schedule && onScheduleChange) {
      onScheduleChange(null);
    }
  };

  const handleDateTimeChange = () => {
    if (onScheduleChange && isScheduled) {
      const isoDate = new Date(`${date}T${time}`).toISOString();
      onScheduleChange(isoDate);
    }
  };

  return (
    <div className="mb-8 mt-6">
      
      <div className="flex items-center space-x-6 mb-4">
        <label className="flex items-center space-x-2">
          <span>Publicar inmediatamente</span>
          <input
            type="radio"
            name="publishOption"
            value="immediate"
            defaultChecked
            onChange={handleOptionChange}
          />

        </label>
        <label className="flex items-center space-x-2">
          <span>Programar</span>
          <input
            type="radio"
            name="publishOption"
            value="schedule"
            onChange={handleOptionChange}
          />
        </label>
      </div>

      {isScheduled && (
        <div className="flex space-x-4">
          <input
            type="date"
            className="border rounded-lg p-2 bg-white text-gray-600"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              handleDateTimeChange();
            }}
          />
          <input
            type="time"
            className="border rounded-lg p-2 bg-white text-gray-600"
            value={time}
            onChange={(e) => {
              setTime(e.target.value);
              handleDateTimeChange();
            }}
          />
        </div>
      )}
    </div>
  );
}
