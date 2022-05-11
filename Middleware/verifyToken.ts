import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import dotenv from 'dotenv'
dotenv.config()

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers['token'] as string

        if (!token) {
            res.json({message: 'Not authorized to access'})
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY as string)

        req.body.user = decoded

        next()
    } catch (error: any) {
        res.json({error: `Invalid token`})
    }
}