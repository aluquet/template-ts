export function formatTimeString(timeString: string, is24H: boolean): string {
    if (!is24H) {
      let [hh, mm, ss] = timeString.split(":").map(Number);
      const period = hh >= 12 ? "PM" : "AM";
      hh = hh % 12;
      if (hh === 0) hh = 12;
      return `${hh.toString().padStart(2, '0')}:${mm
        .toString()
        .padStart(2, '0')}:${ss.toString().padStart(2, '0')} ${period}`;
    }
    return timeString;
  }