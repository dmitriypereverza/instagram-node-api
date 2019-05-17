import { EventEmitter2 } from "eventemitter2";
import { UserSourceInterface } from "../userSources";
import { ActionMakerInterface } from "../actionMakers";
import { SchedulerInterface } from "../scheduler";
import Instagram from "../lib/instagram";

interface StateInterface {
  isTransactionExecute: boolean,
}

interface BotInterface {
  start: () => void,
  stop: () => void
}

class Bot extends EventEmitter2 implements BotInterface {
  private userSource: UserSourceInterface;
  private actionMaker: ActionMakerInterface;
  private scheduler: SchedulerInterface;

  private timer;
  private readonly instagramClient: Instagram;

  private state: StateInterface = {
    isTransactionExecute: false
  };

  constructor(
    client: Instagram,
    scheduler: SchedulerInterface,
    userSource: UserSourceInterface,
    actionMaker: ActionMakerInterface
  ) {
    super({ wildcard: true });
    this.instagramClient = client;
    this.scheduler = scheduler;
    this.userSource = userSource;
    this.actionMaker = actionMaker;

    this.initHandlers();
  }

  private initHandlers () {
    this.scheduler.on('log', text => {
      this.emit('log.scheduler', text);
    });
    this.userSource.on('log', text => {
      this.emit('log.userSource', text);
    });
    this.actionMaker.on('log', text => {
      this.emit('log.actionMaker', text);
    });
  }

  async start() {
    if (! await this.instagramClient.isLogined()) {
      this.emit('log.system', 'Входим в систему.');
      await this.instagramClient.login();
      this.emit('log.system', 'Успешный вход.');
    } else this.emit('log.system', 'Вход не требуется.');

    this.timer = setInterval(() => {
      this.tick();
    }, 1000);
  }

  stop() {
    clearInterval(this.timer);
  }

  private async runIteration() {
    this.state.isTransactionExecute = true;
    try {
      const user = await this.userSource.getNext(this.instagramClient);
      await this.actionMaker.runActions(user, this.instagramClient);

    } catch (e) {
      console.log('ERROR', e);
      if (e.statusCode.toString().charAt(0) === 4) {
        this.emit('error.ban', e.statusMessage);
      }
    }
    this.state.isTransactionExecute = false;
  }

  private tick () {
    if (!this.scheduler.canExec()) {
      if (!this.state.isTransactionExecute) {
        this.emit('log.system', `Ждем ${this.scheduler.getTimeRemains()} секунд.`);
      }
      return;
    }

    if (this.state.isTransactionExecute) {
      return;
    }
    this.scheduler.start();
    this.runIteration();
  }
}

export default Bot;
