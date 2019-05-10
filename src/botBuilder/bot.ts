import EventEmitter from 'events';
import { UserSourceInterface } from "../userSources";
import { ActionMakerInterface } from "../actionMakers";
import { SchedulerInterface } from "../scheduler";

interface BotInterface {
  start: () => void,
  stop: () => void,
}

class Bot extends EventEmitter implements BotInterface {
  private userSource: UserSourceInterface;
  private actionMaker: ActionMakerInterface;
  private scheduler: SchedulerInterface;

  private timer;

  constructor(scheduler: SchedulerInterface, userSource: UserSourceInterface, actionMaker: ActionMakerInterface) {
    super();
    this.scheduler = scheduler;
    this.userSource = userSource;
    this.actionMaker = actionMaker;
  }

  start() {
    this.runIteration();
    this.scheduler.start();
    this.timer = setInterval(() => {
      if (this.scheduler.canExec()) {
        this.runIteration();
        this.scheduler.start();
      }
    }, 1000);
  }

  stop() {
    clearInterval(this.timer);
  }

  private runIteration() {
    const user = this.userSource.getNext();
    this.actionMaker.runActions(user);
  }
}

export default Bot;
