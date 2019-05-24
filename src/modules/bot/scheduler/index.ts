import { EventEmitter2 } from "eventemitter2";
import { time } from "../helpers";

export interface SchedulerInterface {
  start: () => void,
  canExec: () => boolean,
  wait: (time) => void,
  getTimeRemains: () => number,
  on: (type, callback) => void
}

export interface ScheduleConfig {
  delayAction: {
    from: number,
    to: number
  }
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
    this.startTimer();
  }

  startTimer () {
    this.timer = setInterval(() => {
      this.tick();
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timer);
  }

  canExec() {
    return this.timeExpired;
  }

  getTimeRemains () {
    return Math.round(this.expirationTime - time());
  }

  wait(timeWait) {
    this.stopTimer();
    this.expirationTime = time() + timeWait;
    console.log('expirationTime', this.expirationTime);
    this.timeExpired = false;
    this.startTimer();
  }

  performDelay() {
    const { from, to } = this.config.delayAction;
    const delay = from + Math.round(Math.random() * (to - from));

    this.emit('log', `Ждем ${delay} секунд.`);
    return time() + delay;
  }

  private tick () {
    this.timeExpired = this.expirationTime <= time();

    if (this.timeExpired) {
      this.emit('log', `Таймер истек.`);
      this.stopTimer();
    }
  }
}
