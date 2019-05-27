import { Request, Response } from "express";
import { Account } from "../models/account";
import * as passport from "passport";

export async function get (req: Request, res: Response) {
  const account = await Account.findById(req.params.id);
  res.json({ account, user: req.user });
}

export async function list (req: Request, res: Response) {
  const accounts = await Account.find({});
  res.json(accounts);
}

export async function update (req: Request, res: Response) {
  res.send('updateAccount');
}

export async function add (req: Request, res: Response) {
  res.send('addAccount');
}

export async function remove (req: Request, res: Response) {
  res.send('removeAccount');
}
