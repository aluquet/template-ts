import { ClockManager } from "./clockManager";

window.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("clocks-container");
  if (!container) {
    console.error("Clocks container not found!");
    return;
  }

  const clockManager = new ClockManager(container);

  clockManager.addClock("Local", 0);

  const addBtn = document.getElementById("add-clock");
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      const timezoneInput = prompt("Enter timezone GMT+1, GMT-1");
      if (timezoneInput === null || timezoneInput.trim() === "") {
        return;
      }

      const trimmedInput = timezoneInput.trim();
      const match = trimmedInput.match(/GMT([+-]\d+)/);
      if (!match) {
        alert("use GMT+X or GMT-X format");
        return;
      }
      const offset = parseInt(match[1], 10);
      clockManager.addClock(trimmedInput, offset);
    });
  }
});
