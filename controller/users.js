require('dotenv').config()
const express = require('express');
const routes = express.Router();
const db = require('../database/connection');
const { uuid } = require('short-uuid');
const bcrypt = require('bcrypt');
const uid = uuid()
const jwt = require('jsonwebtoken');

const createUsers = routes.post('/register' ,  (req , res)=>{
    const {name , email , password} = req.body;
    console.log(name , email , password)
    const sql = "INSERT INTO user (user_id , name , email , password) VALUES(?,?,?,?)";
    db.query(sql , [uid , name , email , password] ,(err)=>{
        res.setHeader('Content-Type','application/json');
        if(err) return res.status(403).json({
            error : true,
            message : "Failed to create account"
        });
        res.status(201).json({
            error : false,
            message : "Created account success"
        })
    }) 
});

const loginUsers = routes.post('/login' , async (req, res)=>{
    const {email , password} = req.body;
    const sql = "SELECT * FROM user WHERE email =?";
    db.query(sql , [email , password] , (err , fields)=>{
        if(err) throw err;
        if (fields.length === 0 ) {
            res.status(404).json({
                error : true,
                message : "Email not found"
            });
        } else {
            if (password === fields[0].password){
                res.status(200).json({
                error : false,
                message : "success",
                loginResult : {
                    user_id  : fields[0].user_id,
                    name : fields[0].name,
                    email : fields[0].email,
                }
            });
            } else {
                res.status(404).json({
                    message : "Wrong Password"
                })
            }
        }
    });
});

module.exports = {createUsers , loginUsers};
