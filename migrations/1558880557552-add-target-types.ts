require('dotenv').config();

import { TargetType } from "../src/models/target";

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

const targetTypes = [
  { code: 'followers', title: 'По подписчикам' },
  { code: 'hashTag', title: 'По хештегам' },
  { code: 'geo', title: 'По геопозиции' },
  { code: 'list', title: 'По списку' },
];

async function runMigration () {
  for (const type of targetTypes) {
    await TargetType.create(type);
  }
}
