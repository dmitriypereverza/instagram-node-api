import { EventEmitter2 } from "eventemitter2";
import { UserSourceInterface } from "../userSources";
import { ActionMakerInterface } from "../actionMakers";
import { SchedulerInterface } from "../scheduler";
import Instagram from "../lib/instagram";
import { time } from "../helpers";
import { DbType } from "../db";
import { GeneralConfigInterface } from "./index";

interface StateInterface {
  isTransactionExecute: boolean,
}

interface BotInterface {
  start: () => void
}

class Bot extends EventEmitter2 implements BotInterface {
  private userSource: UserSourceInterface;
  private actionMaker: ActionMakerInterface;
  private scheduler: SchedulerInterface;

  private timer;
  private readonly instagramClient: Instagram;
  private db: DbType;

  private state: StateInterface = {
    isTransactionExecute: false
  };
  private config: GeneralConfigInterface;

  constructor(
    config: GeneralConfigInterface,
    client: Instagram,
    db: DbType,
    scheduler: SchedulerInterface,
    userSource: UserSourceInterface,
    actionMaker: ActionMakerInterface
  ) {
    super({ wildcard: true });
    this.config = config;
    this.db = db;
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

    const that = this;
    this.actionMaker.on('action.*', async function(id) {
      await that.db.insert({
        time: time(),
        account: that.instagramClient.credentials.username,
        action: this.event,
        id
      });
    });

    this.actionMaker.on('canLike', function () {
      return new Promise(async function(resolve){
        const { value: likeCountLimit, hours: hoursLimit } = that.config.limits.like;

        let likeCount = await that.db.count({
          time: { $gt: time() - hoursLimit * 60 },
          action: 'action.like',
          account: that.instagramClient.credentials.username
        });
        console.log(`Кол во likeCount ${likeCount}/${likeCountLimit}`);

        resolve(Number(likeCount) < likeCountLimit);
      });
    });
    this.actionMaker.on('canComment', function () {
      return new Promise(async function(resolve){
        const { value: commentCountLimit, hours: hoursLimit } = that.config.limits.comment;

        const commentCount = await that.db.count({
          time: { $gt: time() - hoursLimit * 60 * 60 },
          action: 'action.comment',
          account: that.instagramClient.credentials.username
        });

        console.log(`Кол во commentCount ${commentCount}/${commentCountLimit}`);
        resolve(Number(commentCount) < commentCountLimit);
      });
    });
    this.actionMaker.on('canFollow', function () {
      return new Promise(async function(resolve) {
        const { value: followCountLimit, hours: hoursLimit } = that.config.limits.follow;

        const countFollow = await that.db.count({
          time: { $gt: time() - hoursLimit * 60 * 60 },
          action: 'action.follow',
          account: that.instagramClient.credentials.username
        });

        console.log(`Кол во countFollow ${countFollow}/${followCountLimit}`);
        resolve(Number(countFollow) < followCountLimit);
      });
    });
  }

  async start() {
    await this.login();
    this.startTimer();
  }

  private startTimer () {
    this.timer = setInterval(() => {
      this.tick();
    }, 1000);
  }

  private async login () {
    if (!await this.instagramClient.isLogined()) {
      this.emit('log.system', 'Входим в систему.');
      await this.instagramClient.login();
      this.emit('log.system', 'Успешный вход.');
    } else this.emit('log.system', 'Вход не требуется.');
  }

  stopTimer() {
    clearInterval(this.timer);
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

  private async runIteration() {
    this.state.isTransactionExecute = true;
    try {
      const user = await this.userSource.getNext(this.instagramClient);
      await this.actionMaker.runActions(user, this.instagramClient);
    } catch (e) {
      this.stopTimer();
      this.errorHandle(e);
    }
    this.state.isTransactionExecute = false;
  }

  private errorHandle (e: any) {
    if (e.hasOwnProperty('code')) {
      switch (e.code) {
        case 'limitExpired':
          this.limitExpiredHandler(e.by);
          break;
        default:
          throw new Error(`Передан неизвестный тип ошибки ${e.code}`);
      }
      return;
    }

    if (e.statusCode.toString().charAt(0) == 4) {
      this.emit('error.ban', e);
      this.scheduler.wait(24 * 60 * 60);
      this.emit('log.system',
        `Был получен бан на одно из последних действий. Лучше сегодня не пользоваться услучами этого бота. \nЖдем 24 ч.`);
      return;
    }
  }

  limitExpiredHandler(type) {
    switch (type) {
      case 'like':
        this.scheduler.wait(this.config.limits.like.hours * 60 * 60);
        this.emit('log.system', `Достигнут лимит лайков. Ждем ${this.config.limits.like.hours} часов`);
        break;
      case 'follow':
        this.scheduler.wait(this.config.limits.follow.hours * 60 * 60);
        this.emit('log.system', `Достигнут лимит подписок. Ждем ${this.config.limits.follow.hours} часов`);
        break;
      case 'comment':
        this.scheduler.wait(this.config.limits.comment.hours * 60 * 60);
        this.emit('log.system', `Достигнут лимит комментариев. Ждем ${this.config.limits.comment.hours} часов`);
        break;
      default:
        throw new Error(`Передан неизвестный тип ошибки limitExpired ${type}`);
    }
    this.startTimer();
  }
}

export default Bot;
