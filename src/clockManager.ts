import { Clock } from "./clock";

export class ClockManager {
  private clocks: Clock[] = [];
  private container: HTMLElement;
  private timerId: number | undefined;

  constructor(container: HTMLElement) {
    this.container = container;
    this.setupDragAndDrop();
    this.startGlobalTimer();
  }

  addClock(timezone: string, offset: number): Clock {
    const id = "clock-" + Date.now();
    const clock = new Clock(id, timezone, offset);
    this.clocks.push(clock);
    this.container.appendChild(clock.container);
    clock.init();
    return clock;
  }

  private startGlobalTimer(): void {
    this.timerId = window.setInterval(() => {
      const now = new Date();
      this.clocks.forEach((clock) => clock.updateWithGlobalTime(now));
    }, 1000);
  }

  private setupDragAndDrop(): void {
    this.container.addEventListener("dragover", (e: DragEvent) => {
      e.preventDefault();
    });

    this.container.addEventListener("drop", (e: DragEvent) => {
      e.preventDefault();
      const draggedId = e.dataTransfer?.getData("text/plain");
      if (!draggedId) return;

      const draggedElement = document.querySelector(
        `[data-id="${draggedId}"]`
      ) as HTMLElement;
      if (!draggedElement) return;

      const dropPoint = { x: e.clientX, y: e.clientY };
      let targetElement: HTMLElement | null = null;
      let minDistance = Infinity;

      const otherClocks = Array.from(
        this.container.querySelectorAll(".clock-instance")
      ).filter((el) => el !== draggedElement) as HTMLElement[];

      otherClocks.forEach((clock) => {
        const rect = clock.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distance = Math.sqrt(
          Math.pow(dropPoint.x - centerX, 2) +
            Math.pow(dropPoint.y - centerY, 2)
        );

        if (distance < minDistance) {
          minDistance = distance;
          targetElement = clock;
        }
      });

      if (targetElement) {
        const allClocks = Array.from(
          this.container.querySelectorAll(".clock-instance")
        ) as HTMLElement[];

        const draggedIndex = allClocks.indexOf(draggedElement);
        const targetIndex = allClocks.indexOf(targetElement);

        const draggedNext = draggedElement.nextElementSibling;
        const targetNext = targetElement.nextElementSibling;

        draggedElement.remove();
        targetElement.remove();

        if (draggedIndex < targetIndex) {
          if (targetNext) {
            this.container.insertBefore(draggedElement, targetNext);
          } else {
            this.container.appendChild(draggedElement);
          }

          if (draggedNext === targetElement) {
            this.container.insertBefore(targetElement, draggedElement);
          } else if (draggedNext) {
            this.container.insertBefore(targetElement, draggedNext);
          } else {
            this.container.appendChild(targetElement);
          }
        } else {
          if (draggedNext) {
            this.container.insertBefore(targetElement, draggedNext);
          } else {
            this.container.appendChild(targetElement);
          }

          if (targetNext === draggedElement) {
            this.container.insertBefore(draggedElement, targetElement);
          } else if (targetNext) {
            this.container.insertBefore(draggedElement, targetNext);
          } else {
            this.container.appendChild(draggedElement);
          }
        }

        this.updateClocksArray();
      }
    });
  }

  private updateClocksArray(): void {
    const orderedElements = Array.from(
      this.container.querySelectorAll(".clock-instance")
    );
    this.clocks = orderedElements.map((el) => {
      const clockId = el.getAttribute("data-id")!;
      return this.clocks.find((clock) => clock.id === clockId)!;
    });
  }

  removeClock(id: string): void {
    const index = this.clocks.findIndex((clock) => clock.id === id);
    if (index !== -1) {
      this.clocks[index].remove();
      this.clocks.splice(index, 1);
    }
  }

  getClocks(): Clock[] {
    return this.clocks;
  }
}
