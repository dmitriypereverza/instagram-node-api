import { Request, Response } from "express";
import { Account } from "../models/account";

export async function get (req: Request, res: Response, next) {
  const accountId = Number(req.params.id);
  const account = await Account.findOneWithFilterByUser([
      { $match: { _id: accountId } }
    ], req.user._id);
  if (!account) {
    next();
  }
  res.json(account);
}

export async function list (req: Request, res: Response) {
  const accounts = await Account.findOneWithFilterByUser([], req.user._id);
  res.json(accounts);
}

export async function update (req: Request, res: Response, next) {
  const accountId = Number(req.params.id);
  let account = await Account.findOneWithFilterByUser([
    { $match: { _id: accountId } }
  ], req.user._id);
  if (!account) {
    next();
  }
  account = await Account.updateOne({ _id: account._id }, { $set: req.body.updateParams }, { new: true });
  res.json(account);
}

export async function add (req: Request, res: Response) {
  const account = new Account({...req.body, owner: req.user });
  await account.save();
  res.send(account);
}

export async function remove (req: Request, res: Response, next) {
  const accountId = Number(req.params.id);
  const account = await Account.findOneWithFilterByUser([
    { $match: { _id: accountId } }
  ], req.user._id);
  if (!account) {
    next();
  }
  await Account.deleteOne({ _id: account._id });
  res.send('removeAccount');
}
