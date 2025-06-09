import { Response } from "express";

export class ErrorCommon {
  static badRequest(res: Response, message: string) {
    res.status(400).json({ message: message });
  }

  static unauthorized(res: Response, message: string) {
    res.status(401).json({ message: message });
  }

  static forbidden(res: Response, message: string) {
    res.status(403).json({ message: message });
  }

  static notFound(res: Response, message: string) {
    res.status(404).json({ message: message });
  }

  static internalServerError(res: Response, message: string) {
    res.status(500).json({ message: message });
  }
}
