import { Request, Response } from "express";

export function get (req: Request, res: Response) {
  res.send('getBot');
}

export function list (req: Request, res: Response) {
  res.send('getBots');
}

export function update (req: Request, res: Response) {
  res.send('updateBot');
}

export function add (req: Request, res: Response) {
  res.send('addBot');
}

export function remove (req: Request, res: Response) {
  res.send('removeBot');
}
