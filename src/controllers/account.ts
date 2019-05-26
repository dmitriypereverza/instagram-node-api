import { Request, Response } from "express";

export function get (req: Request, res: Response) {
  res.send('getAccount');
}

export function list (req: Request, res: Response) {
  res.send('getAccounts');
}

export function update (req: Request, res: Response) {
  res.send('updateAccount');
}

export function add (req: Request, res: Response) {
  res.send('addAccount');
}

export function remove (req: Request, res: Response) {
  res.send('removeAccount');
}
