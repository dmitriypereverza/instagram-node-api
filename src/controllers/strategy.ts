import { Request, Response } from "express";

export function get (req: Request, res: Response) {
  res.send('getStrategy');
}

export function list (req: Request, res: Response) {
  res.send('getStrategy');
}

export function update (req: Request, res: Response) {
  res.send('updateStrategy');
}

export function add (req: Request, res: Response) {
  res.send('addStrategy');
}

export function remove (req: Request, res: Response) {
  res.send('removeStrategy');
}
