import { configure, getLogger } from 'log4js';

configure({
  appenders: {
    out: { type: 'stdout' },
    cheese: { type: 'file', filename: './log/cheese.log' }
  },
  categories: {
    default: { appenders: ['cheese', 'out' ], level: 'debug' }
  }
});

const logger = getLogger();
logger.level = 'debug';

export default logger;
