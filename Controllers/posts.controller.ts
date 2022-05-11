import { RequestHandler } from "express";
import mssql from 'mssql'
import sqlConfig from "../Config/sqlConfig";

export const createPost: RequestHandler = async (req, res) => {
    try {
        const user = req.body.user
        const { post_title, post } = req.body as { post_title: string, post: string }

        let pool = await mssql.connect(sqlConfig)
        await pool.request()
        .input('post_title', mssql.VarChar, post_title)
        .input('post', mssql.VarChar, post)
        .input('user_id', mssql.Int, user.user_id)
        .execute('createPost')

        res.json({message: `Post created successfully`})
    } catch (error: any) {
        res.json({error: error.message})
    }
}

export const getPosts: RequestHandler = async(req, res) => {
    try {
        const user = req.body.user

        let pool = await mssql.connect(sqlConfig)
        let posts = await pool.request()
        .input('user_id', mssql.Int, user.user_id)
        .execute('getPosts')

        if (posts.recordset.length == 0) {
            res.json({message: `You have no posts`})
        } else {
            res.json(posts.recordset)
        }
    } catch (error: any) {
        res.json({error: error.message})
    }
}