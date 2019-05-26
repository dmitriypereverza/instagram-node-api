import { Action, ActionSettings, ActionType } from "../src/models/action";

require('dotenv').config();

const mongoose = require('mongoose');

module.exports = {
  up: function (next) {
    mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true});
    mongoose.connection
      .on('error', console.log)
      .once('open', () => runMigration().then(next)
    );
  },
  down: function (next) {
    next()
  }
};

const actionMap = [
  {
    actionType: ActionType.LIKE_BY_INDEX,
    settingsMap: [
      { inputType: 'text', name: 'likeByIndex' }
    ],
  },
  {
    actionType: ActionType.LIKE_RANGE,
    settingsMap: [
      { inputType: 'number', name: 'count' },
      { inputType: 'number', name: 'from' },
      { inputType: 'number', name: 'to' }
    ],
  },
  {
    actionType: ActionType.COMMENT,
    settingsMap: [
      { inputType: 'number', name: 'postNumber' },
      { inputType: 'text', name: 'text' },
    ],
  },
  {
    actionType: ActionType.COMMENT_TEMPLATE,
    settingsMap: [
      { inputType: 'number', name: 'postNumber' },
      { inputType: 'text', name: 'filePath' },
    ],
  },
  {
    actionType: ActionType.FOLLOW,
    settingsMap: [],
  },
  {
    actionType: ActionType.UNFOLLOW,
    settingsMap: [],
  },
  {
    actionType: ActionType.WAIT,
    settingsMap: [
      { inputType: 'number', name: 'timeSeconds' }
    ],
  },
  {
    actionType: ActionType.WAIT_RANGE,
    settingsMap: [
      { inputType: 'number', name: 'from' },
      { inputType: 'number', name: 'to' }
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
