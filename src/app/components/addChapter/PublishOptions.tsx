import { useState } from "react";
import { publishChapter, scheduleChapter } from "../../../infrastructure/services/ChapterService.ts";
import { useNavigate } from "react-router-dom";

interface Props {
  workId: number;
  chapterId: number;
  onScheduleChange?: (isoDate: string | null) => void; //para pasar la fecha y hora al flujo de publicación
}

export default function PublishOptions({ workId, chapterId, onScheduleChange }: Props) {
  const navigate = useNavigate();
  const [date, setDate] = useState("2025-12-24");
  const [time, setTime] = useState("10:30");
  const [isScheduled, setIsScheduled] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [scheduling, setScheduling] = useState(false);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleInput, setScheduleInput] = useState("");

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const schedule = e.target.value === "schedule";
    setIsScheduled(schedule);

    if (!schedule && onScheduleChange) {
      onScheduleChange(null);
    }
  };

  const buildWhenWithOffset = (): string => {
    // Build local datetime with timezone offset, e.g. 2025-10-15T10:00:00-03:00
    const local = new Date(`${date}T${time}:00`);
    const offsetMin = -local.getTimezoneOffset();
    const sign = offsetMin >= 0 ? "+" : "-";
    const abs = Math.abs(offsetMin);
    const hh = String(Math.floor(abs / 60)).padStart(2, "0");
    const mm = String(abs % 60).padStart(2, "0");
    return `${date}T${time}:00${sign}${hh}:${mm}`;
  };

  const handleSchedule = async () => {
    try {
      setScheduleError(null);
      setScheduling(true);
      const when = buildWhenWithOffset();
      const resp = await scheduleChapter(Number(workId), Number(chapterId), when);
      if (!(resp.fetchStatus >= 200 && resp.fetchStatus < 300)) {
        setScheduleError("No se pudo programar la publicación.");
        return;
      }
      navigate(`/manage-work/${workId}`);
    } catch (e) {
      setScheduleError("Error al programar la publicación.");
      console.error(e);
    } finally {
      setScheduling(false);
    }
  };

  const handleDateTimeChange = () => {
    if (onScheduleChange && isScheduled) {
      const isoDate = new Date(`${date}T${time}`).toISOString();
      onScheduleChange(isoDate);
    }
  };

  const handlePublishNow = async () => {
    try {
      setPublishError(null);
      setPublishing(true);
      const resp = await publishChapter(Number(workId), Number(chapterId));
      if (!(resp.fetchStatus >= 200 && resp.fetchStatus < 300)) {
        setPublishError("No se pudo publicar el capítulo.");
      }
      // navigate a manage-work/7
      navigate(`/manage-work/${workId}`);
    } catch (e) {
      setPublishError("Error al publicar el capítulo.");
      console.error(e);
    } finally {
      setPublishing(false);
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

      {!isScheduled && (
        <div className="mb-4">
          <button
            type="button"
            onClick={() => {
              setPublishError(null);
              setShowPublishModal(true);
            }}
            disabled={publishing}
            className="mt-5 px-6 py-3 rounded-md bg-[#172FA6] text-white text-lg font-semibold hover:bg-blue-800 disabled:opacity-60 cursor-pointer"
          >
            {publishing ? "Publicando..." : "Publicar ahora"}
          </button>
        </div>
      )}

      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => !scheduling && setShowScheduleModal(false)} />
          <div className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-2">¿Confirmar programación?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Para confirmar, escribe exactamente: <span className="font-semibold">Programar Capitulo</span>
            </p>
            <input
              type="text"
              value={scheduleInput}
              onChange={(e) => setScheduleInput(e.target.value)}
              placeholder="Programar Capitulo"
              className="w-full border rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            {scheduleError && <p className="text-sm text-red-600 mb-2">{scheduleError}</p>}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => !scheduling && setShowScheduleModal(false)}
                disabled={scheduling}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  if (scheduleInput !== "Programar Capitulo" || scheduling) return;
                  await handleSchedule();
                  setShowScheduleModal(false);
                }}
                disabled={scheduleInput !== "Programar Capitulo" || scheduling}
                className="px-4 py-2 rounded-md bg-[#172FA6] text-white hover:bg-blue-800 disabled:opacity-50"
              >
                {scheduling ? "Programando..." : "Confirmar programación"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isScheduled && (
        <div>
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
          <div className="mt-4">
            <button
              type="button"
              onClick={() => {
                setScheduleInput("");
                setScheduleError(null);
                setShowScheduleModal(true);
              }}
              disabled={scheduling}
            className="mt-5 px-6 py-3 rounded-md bg-[#172FA6] text-white text-lg font-semibold hover:bg-blue-800 disabled:opacity-60 cursor-pointer"
            >
              {scheduling ? "Programando..." : "Programar publicación"}
            </button>
          </div>
        </div>
      )}
      {publishError && (
        <p className="mt-2 text-sm text-red-600">{publishError}</p>
      )}
      {scheduleError && (
        <p className="mt-2 text-sm text-red-600">{scheduleError}</p>
      )}

      {showPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => !publishing && setShowPublishModal(false)}
          />
          <div
            className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-lg p-5 flex flex-col items-center"
          >
            <div className="w-full text-center">
              <h3 className="text-lg font-semibold mb-1">
                ¿Deseas publicar tu capítulo ahora?
              </h3>
              {publishError && (
                <p className="text-sm text-red-600 mb-1">{publishError}</p>
              )}
            </div>

            <div className="w-full flex justify-center gap-3 mt-3">
              <button
                onClick={() => !publishing && setShowPublishModal(false)}
                disabled={publishing}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => handlePublishNow()}
                disabled={publishing}
                className="px-4 py-2 rounded-md text-white bg-blue-800 hover:bg-blue-900 disabled:opacity-50"
              >
                Confirmar publicación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
