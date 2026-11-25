/**
 * First-time user experience (FTUE) 4-step starter checklist.
 */
export class Onboarding {
  constructor() {
    this.steps = [
      { id: 'till', label: 'Till a dirt patch with Hoe', done: false },
      { id: 'plant', label: 'Plant Spring Root seeds', done: false },
      { id: 'water', label: 'Water your planted crop', done: false },
      { id: 'ship', label: 'Ship 1 harvested crop', done: false }
    ];
    this.dismissed = false;
  }

  markDone(stepId) {
    const step = this.steps.find((s) => s.id === stepId);
    if (step) step.done = true;
  }

  isComplete() {
    return this.steps.every((s) => s.done);
  }
}
