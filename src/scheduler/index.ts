export interface SchedulerInterface {
  start: () => void,
  canExec: () => boolean
}

export interface ScheduleConfig {
  delayAction: {
    from: number,
    to: number
  }
}

function time() {
  return (new Date()).getTime()/1000;
}

export default class Scheduler implements SchedulerInterface {
  private config: ScheduleConfig;
  private expirationTime: number;

  constructor(config: ScheduleConfig) {
    this.config = config;
  }

  start() {
    this.performDelay();
  }

  canExec() {
    return this.expirationTime <= time();
  }

  performDelay() {
    const { from, to } = this.config.delayAction;
    const delay = from + Math.round(Math.random() * (to - from));

    this.expirationTime = time() + delay;
  }
}
