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
  private timer: NodeJS.Timeout;
  private timeExpired = true;

  constructor(config: ScheduleConfig) {
    super();
    this.config = config;
  }

  start() {
    this.expirationTime = this.performDelay();

    this.timer = setInterval(() => {
      this.tick();
    }, 1000);
  }

  stop() {
    clearInterval(this.timer);
  }

  canExec() {
    return this.timeExpired;
  }

  performDelay() {
    const { from, to } = this.config.delayAction;
    const delay = from + Math.round(Math.random() * (to - from));

    this.emit('log', `Ждем ${delay} секунд.`);
    return time() + delay;
  }

  private tick () {
    this.timeExpired = this.expirationTime <= time();
    this.emit('log', `Ждем ${Math.round(this.expirationTime - time())} секунд.`);

    if (this.timeExpired) {
      this.emit('log', `Таймер истек.`);
      this.stop();
    }
  }
}
