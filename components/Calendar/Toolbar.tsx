import type React from "react"
import type { View, ToolbarProps } from "react-big-calendar"
import moment from "moment"
import "moment/locale/pt-br" // Import Portuguese locale

const CalendarToolbar: React.FC<ToolbarProps> = (props) => {
  // Set moment locale to Portuguese
  moment.locale("pt-br")

  const goToBack = () => {
    props.onNavigate("PREV")
  }

  const goToNext = () => {
    props.onNavigate("NEXT")
  }

  const goToView = (view: View) => {
    props.onView(view)
  }

  const currentDate = moment(props.date).format("DD [de] MMMM[,] YYYY")
  const dateRange = `${moment(props.date).startOf("week").format("DD/MM/YYYY")} - ${moment(props.date)
    .endOf("week")
    .format("DD/MM/YYYY")}`

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="w-10">
          <button
            onClick={goToBack}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-[#6B7AE8] bg-[#F8F7FF] hover:bg-[#6B7AE8]/10"
          >
            &lt;
          </button>
        </div>
        <div className="flex flex-col items-center">
          <div className="inline-flex rounded-lg overflow-hidden border border-[#6B7AE8]/20 mb-2">
            <button
              onClick={() => goToView("day")}
              className={`px-4 py-1.5 text-sm ${
                props.view === "day" ? "bg-[#6B7AE8] text-white" : "text-[#6B7AE8] hover:bg-[#6B7AE8]/10"
              }`}
            >
              Dia
            </button>
            <button
              onClick={() => goToView("week")}
              className={`px-4 py-1.5 text-sm ${
                props.view === "week" ? "bg-[#6B7AE8] text-white" : "text-[#6B7AE8] hover:bg-[#6B7AE8]/10"
              }`}
            >
              Semana
            </button>
            <button
              onClick={() => goToView("month")}
              className={`px-4 py-1.5 text-sm ${
                props.view === "month" ? "bg-[#6B7AE8] text-white" : "text-[#6B7AE8] hover:bg-[#6B7AE8]/10"
              }`}
            >
              Mês
            </button>
          </div>
          <div className="text-sm text-[#6B7AE8]/70">{dateRange}</div>
        </div>
        <div className="w-10">
          <button
            onClick={goToNext}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-[#6B7AE8] bg-[#F8F7FF] hover:bg-[#6B7AE8]/10"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  )
}

export default CalendarToolbar

