import { RequestHandler } from "express";
import bcrypt from 'bcrypt'

import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

import mssql from 'mssql'
import sqlConfig from "../Config/sqlConfig";

let refresh_tokens: string[] = []

export const createUser: RequestHandler = async (req, res) => {
    try {
        const { user_name, user_email, user_pwd } = req.body as { user_name: string, user_email: string, user_pwd: string }

        let pool = await mssql.connect(sqlConfig)
        let user = await pool.request()
        .input('email', mssql.VarChar, user_email)
        .execute('getUser')

        if (user.recordset[0]) {
            res.json({message: 'User already exists'})
        } else {
            const hashedPwd = await bcrypt.hash(user_pwd, 10)
                    
            await pool.request()
            .input('user_name', mssql.VarChar, user_name)
            .input('user_email', mssql.VarChar, user_email)
            .input('user_pwd', mssql.VarChar, hashedPwd)
            .execute('createUser')

            res.json({message: 'User created successfully'})
        }         
    } catch (error: any) {
        res.json({error: error.message})
    }
}

export const login: RequestHandler = async (req, res) => {
    try {
        const { user_email, user_pwd } = req.body as { user_email: string, user_pwd: string }

        let pool = await mssql.connect(sqlConfig)
        let user = await pool.request()
        .input('email', mssql.VarChar, user_email)
        .execute('getUser')

        if (!user.recordset[0]) {
            res.json({message: `Invalid credentials`})
        } else {            
            if (!await bcrypt.compare( user_pwd, user.recordset[0].user_pwd)) {
                res.json({message: `Invalid credentials`})
            } else {
                let user_info = await pool.request().query(`SELECT user_id, user_email FROM users WHERE user_email = '${user_email}'`)

                let payload = user_info.recordset[0]

                const token = jwt.sign(payload, process.env.SECRET_KEY as string, { expiresIn: '10m'})

                const refresh_token = jwt.sign(payload, process.env.REFRESH_KEY as string)

                refresh_tokens.push(refresh_token)

                res.json({message: 'Logged in  successfully', payload: payload,  token: token, refresh_token: refresh_token})
            }

        }
    } catch (error: any) {
        res.json({error: error.message})
    }
}

export const token: RequestHandler = async(req, res) => {
    const refresh_token = req.body.refresh_token 

    if(!refresh_token) return res.json({message: `Unauthorized!`})
    if (!refresh_tokens.includes(refresh_token)) return res.json({message: `Invalid refresh token`})
    jwt.verify(refresh_token, process.env.REFRESH_KEY as string, (err: any, user: any) => {
        if(err) return res.json({error: err})

        delete user.iat 

        const token = jwt.sign(user, process.env.SECRET_KEY as string, { expiresIn: '10m' })
        res.json({token: token})
    })
}

export const getUsers: RequestHandler = async (req, res) => {
    try {
        let pool = await mssql.connect(sqlConfig)
        let users = await pool.request().execute('getUsers')

        if (users.recordset.length === 0) {
            res.json({message: `There are no users`})
        }

        res.json(users.recordset)
    } catch (error: any) {
        res.json({error: error.message})
    }
}

export const getUser: RequestHandler<{email: string}> = async (req, res) => {
    try {
        const user_email = req.params.email

        let pool = await mssql.connect(sqlConfig)
        let user = await pool.request()
        .input('email', mssql.VarChar, user_email)
        .execute('getUser')

        if (!user.recordset[0]) {
            res.json({message: `User with email: ${user_email} does not exist`})
        }

        res.json(user.recordset[0])
    } catch (error: any) {
        res.json({error: error.message})
    }
}