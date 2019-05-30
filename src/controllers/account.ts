import { Request, Response } from "express";
import { Account } from "../models/account";

export async function get (req: Request, res: Response) {
  const accountId = Number(req.params.id);
  const account = await Account.aggregate([
    { $match: { _id: accountId } },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner"
      }
    },
    { $unwind: "$owner" },
    { $match: { "owner._id": req.user._id } },
  ]);
  res.json({ account });
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
