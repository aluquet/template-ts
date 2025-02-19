export class WatchView {
  container: HTMLElement;
  digitalDisplay: HTMLElement;
  analogDisplay: HTMLElement;
  hoursElement: HTMLElement;
  minutesElement: HTMLElement;
  secondsElement: HTMLElement;
  modeButton: HTMLElement;
  increaseButton: HTMLElement;
  lightButton: HTMLElement;
  hourNeedle?: HTMLElement;
  minuteNeedle?: HTMLElement;
  secondNeedle?: HTMLElement;
  private isYellow: boolean;

  constructor(container?: HTMLElement) {
    this.container = container || document.body;
    this.digitalDisplay = this.container.querySelector(".digital-display")!;
    this.analogDisplay = this.container.querySelector(".analog-display")!;
    this.hoursElement = this.digitalDisplay.querySelector(".hours")!;
    this.minutesElement = this.digitalDisplay.querySelector(".minutes")!;
    this.secondsElement = this.digitalDisplay.querySelector(".seconds")!;
    this.modeButton = this.container.querySelector(".watch-button.top")!;
    this.increaseButton = this.container.querySelector(".watch-button.right")!;
    this.lightButton = this.container.querySelector(".watch-button.bottom")!;
    this.hourNeedle = this.container.querySelector(".needle.hour") || undefined;
    this.minuteNeedle =
      this.container.querySelector(".needle.minute") || undefined;
    this.secondNeedle =
      this.container.querySelector(".needle.second") || undefined;
    this.isYellow = false;
  }

  renderTime(time: string): void {
    const parts = time.split(":");
    this.hoursElement.textContent = parts[0];
    this.minutesElement.textContent = parts[1];
    this.secondsElement.textContent = parts[2];
  }

  toggleBackground(): void {
    this.isYellow = !this.isYellow;
    this.digitalDisplay.style.backgroundColor = this.isYellow
      ? "#FBE106"
      : "#FFFFFF";
  }

  blinkHours(isBlinking: boolean): void {
    if (isBlinking) {
      this.hoursElement.classList.add("blink");
    } else {
      this.hoursElement.classList.remove("blink");
    }
  }

  blinkMinutes(isBlinking: boolean): void {
    if (isBlinking) {
      this.minutesElement.classList.add("blink");
    } else {
      this.minutesElement.classList.remove("blink");
    }
  }

  bindModeClick(handler: () => void): void {
    this.modeButton.addEventListener("click", handler);
  }

  bindIncreaseClick(handler: () => void): void {
    this.increaseButton.addEventListener("click", handler);
  }

  bindLightClick(handler: () => void): void {
    this.lightButton.addEventListener("click", handler);
  }

  rotateNeedle(needle: HTMLElement, angle: number): void {
    const radians = (angle * Math.PI) / 180;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    const matrix = `matrix(${cos}, ${sin}, ${-sin}, ${cos}, 0, 0)`;
    needle.style.transform = matrix;
  }

  updateAnalogHands(hours: number, minutes: number, seconds: number): void {
    if (this.hourNeedle && this.minuteNeedle && this.secondNeedle) {
      const secondAngle = seconds * 6;
      const minuteAngle = minutes * 6 + seconds * 0.1;
      const hourAngle = hours * 30 + minutes * 0.5;
      this.rotateNeedle(this.secondNeedle, secondAngle);
      this.rotateNeedle(this.minuteNeedle, minuteAngle);
      this.rotateNeedle(this.hourNeedle, hourAngle);
    }
  }

  toggleUIMode(isAnalog: boolean): void {
    if (isAnalog) {
      this.digitalDisplay.style.display = "none";
      this.analogDisplay.style.display = "block";
    } else {
      this.digitalDisplay.style.display = "block";
      this.analogDisplay.style.display = "none";
    }
  }
}
