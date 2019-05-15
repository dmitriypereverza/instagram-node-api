import EventEmitter from 'events';
import { UserSourceInterface } from "../userSources";
import { ActionMakerInterface } from "../actionMakers";
import { SchedulerInterface } from "../scheduler";
import Instagram from "../lib/instagram";

interface BotInterface {
  start: () => void,
  stop: () => void,
}

class Bot extends EventEmitter implements BotInterface {
  private userSource: UserSourceInterface;
  private actionMaker: ActionMakerInterface;
  private scheduler: SchedulerInterface;

  private timer;
  private readonly instagramClient: Instagram;

  constructor(
    client: Instagram,
    scheduler: SchedulerInterface,
    userSource: UserSourceInterface,
    actionMaker: ActionMakerInterface
  ) {
    super();
    this.instagramClient = client;
    this.scheduler = scheduler;
    this.userSource = userSource;
    this.actionMaker = actionMaker;

    this.initHandlers();
  }

  private initHandlers () {
    this.scheduler.on('log', text => {
      console.log(text);
    });
    this.userSource.on('log', text => {
      console.log(text);
    });
  }

  async start() {
    if (! await this.instagramClient.isLogined()) {
      console.log(`Login ...`);
      await this.instagramClient.login();
      console.info('Login success.');
    }

    await this.runIteration();
    this.scheduler.start();
    this.timer = setInterval(async () => {
      if (this.scheduler.canExec()) {
        await this.runIteration();
        this.scheduler.start();
      }
    }, 1000);
  }

  stop() {
    clearInterval(this.timer);
  }

  private async runIteration() {
    const user = await this.userSource.getNext(this.instagramClient);
    this.actionMaker.runActions(user, this.instagramClient);
  }
}

export default Bot;
