import { WatchModel, EditMode } from "./model";
import { WatchView } from "./view";
import { WatchController } from "./controller";
import { formatTimeString } from "./helper";

export class Clock {
  id: string;
  timezone: string;
  offset: number;
  format24H: boolean = true;
  isAnalog: boolean = false;
  model: WatchModel;
  view: WatchView;
  controller: WatchController;
  container: HTMLElement;

  constructor(id: string, timezone: string, offset: number) {
    this.id = id;
    this.timezone = timezone;
    this.offset = offset;

    this.container = document.createElement("div");
    this.container.className = "clock-instance";
    this.container.setAttribute("data-id", this.id);
    this.container.setAttribute("draggable", "true");

    this.container.innerHTML = `
      <div class="watch">
        <div class="watch-inner">
          <div class="brand">${this.timezone}</div>
          <img src="./assets/images/brand-clock.png" alt="GE Healthcare Logo" class="ge-logo">
          <div class="digital-display">
            <span class="hours">00</span>:<span class="minutes">00</span>:<span class="seconds">00</span>
          </div>
           <div class="analog-display" style="display: none; position: relative; width: 100%; height: 100%;">
            <div class="needle hour"></div>
            <div class="needle minute"></div>
            <div class="needle second"></div>
            <div class="center-dot"></div>
          </div>
        </div>
        <div class="watch-buttons">
          <button class="watch-button top" title="Mode">Mode</button>
          <button class="watch-button right" title="Increase">Increase</button>
          <button class="watch-button bottom" title="Light">Light</button>
        </div>
        <div class="extra-buttons">
          <button class="toggle-format" title="Toggle Format">Toggle</button>
          <button class="reset" title="Reset Time">Reset</button>
          <button class="remove" title="Remove Clock">Remove</button>
          <button class="switch-ui" title="Switch UI">Switch UI</button>
        </div>
      </div>
    `;

    this.view = new WatchView(this.container);
    this.model = new WatchModel(this.offset);
    this.controller = new WatchController(
      this.model,
      this.view,
      () => this.format24H
    );

    const toggleButton = this.container.querySelector(
      ".toggle-format"
    ) as HTMLButtonElement;
    toggleButton.addEventListener("click", () => this.toggleTimeFormat());

    const resetButton = this.container.querySelector(
      ".reset"
    ) as HTMLButtonElement;
    resetButton.addEventListener("click", () => this.resetTime());

    const removeButton = this.container.querySelector(
      ".remove"
    ) as HTMLButtonElement;
    removeButton.addEventListener("click", () => this.remove());

    const switchUIButton = this.container.querySelector(".switch-ui") as HTMLButtonElement;
    switchUIButton.addEventListener("click", () => this.toggleUIMode());


    this.container.addEventListener("dragstart", (e: DragEvent) => {
      e.dataTransfer?.setData("text/plain", this.id);
      this.container.classList.add("dragging");
    });

    this.container.addEventListener("dragend", () => {
      this.container.classList.remove("dragging");
    });
  }

  init(): void {
    this.controller.init();
  }

  update(): void {
    const savedHour = this.model.hours;
    const savedMinute = this.model.minutes;

    this.model.updateTime();

    if (this.model.mode === EditMode.Hours) {
      this.model.hours = savedHour;
    } else if (this.model.mode === EditMode.Minutes) {
      this.model.minutes = savedMinute;
    }

    let timeString = this.model.getTimeString();

    if (!this.format24H) {
      timeString = formatTimeString(timeString, this.format24H);
    }

    if (this.isAnalog) {
        this.view.updateAnalogHands(
            this.model.hours,
            this.model.minutes,
            this.model.seconds
        );
    } else {
        this.view.renderTime(timeString);
    }


    if (this.model.mode === EditMode.Hours) {
      this.view.blinkHours(true);
      this.view.blinkMinutes(false);
    } else if (this.model.mode === EditMode.Minutes) {
      this.view.blinkHours(false);
      this.view.blinkMinutes(true);
    } else {
      this.view.blinkHours(false);
      this.view.blinkMinutes(false);
    }
  }

  updateWithGlobalTime(now: Date): void {
    const savedHour = this.model.hours;
    const savedMinute = this.model.minutes;
  
    this.model.seconds = now.getSeconds();
  
    if (!this.model.isManuallyEdited) {
      this.model.hours = (now.getHours() + this.offset + 24) % 24;
      this.model.minutes = now.getMinutes();
    } else {
      this.model.hours = savedHour;
      this.model.minutes = savedMinute;
    }
  
    let timeString = this.model.getTimeString();
    if (!this.format24H) {
      timeString = formatTimeString(timeString, this.format24H);
    }
  
    if (this.isAnalog) {
      this.view.updateAnalogHands(this.model.hours, this.model.minutes, this.model.seconds);
    } else {
      this.view.renderTime(timeString);
    }
  
    if (this.model.mode === EditMode.Hours) {
      this.view.blinkHours(true);
      this.view.blinkMinutes(false);
    } else if (this.model.mode === EditMode.Minutes) {
      this.view.blinkHours(false);
      this.view.blinkMinutes(true);
    } else {
      this.view.blinkHours(false);
      this.view.blinkMinutes(false);
    }
  }  

  toggleTimeFormat(): void {
    this.format24H = !this.format24H;
    const timeString = formatTimeString(
      this.model.getTimeString(),
      this.format24H
    );
    this.view.renderTime(timeString);
  }

  resetTime(): void {
    this.model.resetTime();
    if (this.model.mode === EditMode.Hours) {
      this.model.increaseHours();
    } else if (this.model.mode === EditMode.Minutes) {
      this.model.increaseMinutes();
    }
    this.update();
  }

  toggleUIMode(): void {
    this.isAnalog = !this.isAnalog;
    this.view.toggleUIMode(this.isAnalog);
    if (this.isAnalog) {
      this.view.updateAnalogHands(this.model.hours, this.model.minutes, this.model.seconds);
    } else {
      const timeString = formatTimeString(this.model.getTimeString(), this.format24H);
      this.view.renderTime(timeString);
    }
  }

  remove(): void {
    if (this.container.parentElement) {
      this.container.parentElement.removeChild(this.container);
    }
  }
}
