import { WatchModel, EditMode } from "./model";
import { WatchView } from "./view";
import { formatTimeString } from "./helper";

export class WatchController {
  private model: WatchModel;
  private view: WatchView;
  private timerId: number | undefined;
  private getFormat24H: () => boolean;

  constructor(model: WatchModel, view: WatchView, getFormat24H: () => boolean) {
    this.model = model;
    this.view = view;
    this.getFormat24H = getFormat24H;

    this.view.bindModeClick(() => this.handleModeClick());
    this.view.bindIncreaseClick(() => this.handleIncreaseClick());
    this.view.bindLightClick(() => this.handleLightClick());
  }

  init(): void {
    this.view.renderTime(this.model.getTimeString());
  }

  updateWatch(): void {
    this.model.updateTime();
    this.view.renderTime(this.model.getTimeString());

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

  handleModeClick(): void {
    this.model.cycleMode();
  }

  handleIncreaseClick(): void {
    if (this.model.mode === EditMode.Hours) {
      this.model.increaseHours();
    } else if (this.model.mode === EditMode.Minutes) {
      this.model.increaseMinutes();
    }
    const formattedTime = formatTimeString(this.model.getTimeString(), this.getFormat24H());
    this.view.renderTime(formattedTime);
  }
  

  handleLightClick(): void {
    this.view.toggleBackground();
  }
}
