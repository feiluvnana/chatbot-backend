import { Request, Response } from "express";

export async function usersProfileHandler(req: Request, res: Response) {
  res.status(200).json(req.user);
}
