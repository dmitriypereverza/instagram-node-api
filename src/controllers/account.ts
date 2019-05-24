import { Request, Response } from "express";

export function getAccount (req: Request, res: Response) {
  res.send('getAccount');
}

export function getAccounts (req: Request, res: Response) {
  res.send('getAccounts');
}
