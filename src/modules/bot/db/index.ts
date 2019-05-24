import DataStore from "nedb";
import { promisify } from "util";

let nedb = new DataStore({ filename: 'src/db/data/actions.json', autoload: true });

const db = Object.assign(nedb, {
  insert: promisify(nedb.insert) as (any) => Promise<any>,
  count: promisify(nedb.count) as (any) => Promise<number>,
  find: promisify(nedb.find) as (any) => Promise<any>,
  findOne: promisify(nedb.findOne) as (any) => Promise<any>,
  update: promisify(nedb.update) as (any) => Promise<any>,
});

export type DbType = typeof db;
export default db;
