import { Action, ActionSettings, ActionType } from "../src/models/action";

require('dotenv').config();

const mongoose = require('mongoose');

module.exports = {
  up: function (next) {
    mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true});
    mongoose.connection
      .on('error', console.log)
      .once('open', () => runMigration().then(next).catch(next)
    );
  },
  down: function (next) {
    next()
  }
};

const actionMap = [
  {
    title: 'Лайк записи',
    actionType: ActionType.LIKE_BY_INDEX,
    settingsMap: [
      { inputType: 'text', name: 'postNumber', title: 'Номер записи' }
    ],
  },
  {
    title: 'Лайк из диапазона',
    actionType: ActionType.LIKE_RANGE,
    settingsMap: [
      { inputType: 'number', name: 'count', title: 'Кол-во лайков' },
      { inputType: 'number', name: 'from', title: 'От' },
      { inputType: 'number', name: 'to', title: 'До' }
    ],
  },
  {
    title: 'Комментарий',
    actionType: ActionType.COMMENT,
    settingsMap: [
      { inputType: 'number', name: 'postNumber', title: 'Номер записи' },
      { inputType: 'text', name: 'text', title: 'Текст комментария' },
    ],
  },
  {
    title: 'Комментарий по шаблону',
    actionType: ActionType.COMMENT_TEMPLATE,
    settingsMap: [
      { inputType: 'number', name: 'postNumber', title: 'Номер записи' },
      { inputType: 'file', name: 'filePath', title: 'Файл с шаблонами' },
    ],
  },
  {
    title: 'Подписка',
    actionType: ActionType.FOLLOW,
    settingsMap: [],
  },
  {
    title: 'Отписка',
    actionType: ActionType.UNFOLLOW,
    settingsMap: [],
  },
  {
    title: 'Ожидание',
    actionType: ActionType.WAIT,
    settingsMap: [
      { inputType: 'number', name: 'timeSeconds', title: 'Кол-во секунд' }
    ],
  },
  {
    title: 'Ожидание по диапазону',
    actionType: ActionType.WAIT_RANGE,
    settingsMap: [
      { inputType: 'number', name: 'from', title: 'От' },
      { inputType: 'number', name: 'to', title: 'До' }
    ],
  }
];

async function runMigration() {
  console.log('Start migration...');
  for (const item of actionMap) {

    const settings = [];
    for (const settingMap of item.settingsMap) {
      const setting = new ActionSettings(settingMap);
      await setting.save();
      settings.push(setting);
    }

    const action = new Action({
      actionType: item.actionType,
      actionSettings: settings
    });

    await action.save();
  }
}
