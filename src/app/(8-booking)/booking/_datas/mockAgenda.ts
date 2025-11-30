const mockAgenda = [
  // Day 1 - 2025-10-29 (Wed)
  { start: "2025-10-29T09:00:00Z", end: "2025-10-29T09:30:00Z", patient: null },
  { start: "2025-10-29T09:30:00Z", end: "2025-10-29T10:00:00Z", patient: null },
  { start: "2025-10-29T10:00:00Z", end: "2025-10-29T10:30:00Z", patient: null },
  { start: "2025-10-29T10:30:00Z", end: "2025-10-29T11:00:00Z", patient: "John Doe" },
  { start: "2025-10-29T11:00:00Z", end: "2025-10-29T11:30:00Z", patient: null },
  { start: "2025-10-29T13:00:00Z", end: "2025-10-29T13:30:00Z", patient: "John Doe" },
  { start: "2025-10-29T13:30:00Z", end: "2025-10-29T14:00:00Z", patient: null },
  { start: "2025-10-29T14:00:00Z", end: "2025-10-29T14:30:00Z", patient: null },
  { start: "2025-10-29T14:30:00Z", end: "2025-10-29T15:00:00Z", patient: null },
  { start: "2025-10-29T15:00:00Z", end: "2025-10-29T15:30:00Z", patient: null },

  // Day 2 - 2025-10-30 (Thu)
  ...generateDaySlots("2025-10-30"),
  // Day 3 - 2025-10-31 (Fri)
  ...generateDaySlots("2025-10-31"),
  // Day 4 - 2025-11-03 (Mon)
  ...generateDaySlots("2025-11-03"),
  // Day 5 - 2025-11-04 (Tue)
  ...generateDaySlots("2025-11-04"),
  // Day 6 - 2025-11-05 (Wed)
  ...generateDaySlots("2025-11-05"),
  // Day 7 - 2025-11-06 (Thu)
  ...generateDaySlots("2025-11-06"),
  // Day 8 - 2025-11-07 (Fri)
  ...generateDaySlots("2025-11-07"),
  // Day 9 - 2025-11-10 (Mon)
  ...generateDaySlots("2025-11-10"),
  // Day 10 - 2025-11-11 (Tue)
  ...generateDaySlots("2025-11-11"),
]

// Helper to generate day slots
function generateDaySlots(date : string) {
  const slots = []
  const times = ["09:00","09:30","10:00","10:30","11:00","13:00","13:30","14:00","14:30","15:00"]
  for (const t of times) {
    const [hour, minute] = t.split(":").map(Number)
    const endMinute = minute + 30
    const endHour = endMinute >= 60 ? hour + 1 : hour
    const endMin = endMinute >= 60 ? endMinute - 60 : endMinute
    const pad = (n : number) => String(n).padStart(2, "0")
    slots.push({
      start: `${date}T${pad(hour)}:${pad(minute)}:00Z`,
      end: `${date}T${pad(endHour)}:${pad(endMin)}:00Z`,
      patient: null
    })
  }
  return slots;
}

export default mockAgenda;