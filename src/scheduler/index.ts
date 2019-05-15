import { EventEmitter2 } from "eventemitter2";

export interface SchedulerInterface {
  start: () => void,
  canExec: () => boolean,
  on: (type, callback) => void
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

export default class Scheduler extends EventEmitter2 implements SchedulerInterface {
  private config: ScheduleConfig;
  private expirationTime: number;

  constructor(config: ScheduleConfig) {
    super();
    this.config = config;
  }

  start() {
    this.expirationTime = this.performDelay();
  }

  canExec() {
    return this.expirationTime <= time();
  }

  performDelay() {
    const { from, to } = this.config.delayAction;
    const delay = from + Math.round(Math.random() * (to - from));

    this.emit('log', `Ждем ${delay} секунд.`);

    return time() + delay;
  }
}
