import fs from "fs";
import * as path from "path";
import { ActionInterface } from "./buildAction";
import Instagram from "../lib/instagram";
import { TransactionBundleInterface } from "../actionMakers/DefaultActionMaker";
import { EventEmitter2 } from "eventemitter2";

interface CommentTemplateConfigInterface {
  filePath: string,
  postNumber: number,
}

export default class CommentTemplate extends EventEmitter2 implements ActionInterface {
  private config: CommentTemplateConfigInterface;
  private readonly templateList: string[] = [];

  constructor(config: CommentTemplateConfigInterface) {
    super();
    this.config = config;

    const templatesFilePath = path.resolve('./store/' + this.config.filePath);
    if (!fs.existsSync(templatesFilePath)) {
      throw new Error(`Файл ${this.config.filePath} не существует.`);
    }
    this.templateList = fs.readFileSync(templatesFilePath, 'utf-8').split('\n\n');
  }

  run(transactionBundle: TransactionBundleInterface, client: Instagram) {
    return new Promise(async (resolve, reject) => {
      const [ [ canFollow ] ] = await this.emitAsync('canComment');
      if (!canFollow) {
        reject({
          code: 'limitExpired',
          by: 'comment',
          message: 'Досигнут лимит комментариев.',
        });
      }

      let template = this.getRandomOfList(this.templateList);
      template = template.replace(/\|/g, '~~');

      const resultComment = template.replace(/{.*?}/gm, match => {
        const cases = match.match(/([^\~\~\{\}]+)/g);
        delete cases['index'];
        delete cases['input'];
        delete cases['groups'];

        return this.getRandomOfList(cases);
      });

      const post = transactionBundle.posts[this.config.postNumber - 1];
      try {
        this.emit('log', `Пишем сгенерированный комментарий [${resultComment}]`);
        await client.addComment(post.id, resultComment);
        this.emit('action.comment', post.id);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  private getRandomOfList(list): string {
    return list[Math.ceil(Math.random() * list.length) - 1];
  }
}

