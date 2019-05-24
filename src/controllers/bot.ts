import { Request, Response } from "express";

export function getBot (req: Request, res: Response) {
  res.send('getBot');
}

export function getBots (req: Request, res: Response) {
  res.send('getBots');
}
