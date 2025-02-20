export enum EditMode {
  None,
  Hours,
  Minutes,
}

export class WatchModel {
  hours: number;
  minutes: number;
  seconds: number;
  isManuallyEdited: boolean;
  mode: EditMode;
  offset: number;

  constructor(offset = 0) {
    this.offset = offset;
    this.initWithCurrentTime();
  }

  private initWithCurrentTime(): void {
    const now = new Date();
    this.hours = (now.getHours() + this.offset + 24) % 24;
    this.minutes = now.getMinutes();
    this.seconds = now.getSeconds();
    this.mode = EditMode.None;
  }

  updateTime(): void {
    this.seconds++;
    if (this.seconds >= 60) {
      this.seconds = 0;
      this.minutes++;
      if (this.minutes >= 60) {
        this.minutes = 0;
        this.hours = (this.hours + 1) % 24;
      }
    }
  }

  getTimeString(): string {
    const hh = this.hours.toString().padStart(2, "0");
    const mm = this.minutes.toString().padStart(2, "0");
    const ss = this.seconds.toString().padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  }

  increaseHours(): void {
    this.hours = (this.hours + 1) % 24;
    this.isManuallyEdited = true;
  }

  increaseMinutes(): void {
    this.minutes++;
    if (this.minutes >= 60) {
      this.minutes = 0;
      this.increaseHours();
    } else {
      this.isManuallyEdited = true;
    }
  }

  cycleMode(): void {
    if (this.mode === EditMode.None) {
      this.mode = EditMode.Hours;
    } else if (this.mode === EditMode.Hours) {
      this.mode = EditMode.Minutes;
    } else {
      this.mode = EditMode.None;
    }
  }

  resetTime(): void {
    this.initWithCurrentTime();
    this.isManuallyEdited = false;
  }
}
