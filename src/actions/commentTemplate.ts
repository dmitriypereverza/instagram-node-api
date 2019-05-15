import fs from "fs";
import * as path from "path";
import { ActionInterface } from "./buildAction";
import Instagram from "../lib/instagram";
import { TransactionBundleInterface } from "../actionMakers/DefaultActionMaker";

interface CommentTemplateConfigInterface {
  filePath: string,
  postNumber: number,
}

export default class CommentTemplate implements ActionInterface {
  private config: CommentTemplateConfigInterface;
  private templateList: string[] = [];

  constructor(config: CommentTemplateConfigInterface) {
    this.config = config;

    const templatesFilePath = path.resolve('./store/' + this.config.filePath);

    console.log(templatesFilePath);
    if (!fs.existsSync(templatesFilePath)) {
      throw new Error(`Файл ${this.config.filePath} не существует.`);
    }
    this.templateList = fs.readFileSync(templatesFilePath, 'utf-8').split('\n\n');
  }

  run(transactionBundle: TransactionBundleInterface, client: Instagram) {
    return new Promise(async resolve => {
      console.log("Add comment by template!!!");

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
      // await client.addComment(post.id, resultComment);

      console.log(resultComment);
      resolve();
    });
  }

  private getRandomOfList(list): string {
    return list[Math.ceil(Math.random() * list.length) - 1];
  }
}

