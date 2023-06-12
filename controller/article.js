const express = require('express');
const routes = express.Router();
const db = require('../database/connection');
const { v4: uuidv4 } = require('uuid');

const routesArticles = routes.get('/article' , (req , res)=>{
    const sql = "SELECT * FROM article";
    db.query(sql , (err , fields)=>{
        if (err) throw err;
        res.status(200).json({
            data : fields ,
        });
    });
});

const getRouteById = routes.get('/article/:article_id' , (req , res) =>{
    res.setHeader('Content-Type','aplication/json');
    const id = req.params.article_id;
    const sql = `SELECT article_id , judul , penjelasan , link FROM article WHERE article_id = ?`;
    db.query(sql , [id] , (err , fields)=>{
        if(fields.length === 0) {
            res.status(404).json({
                error : true,
                message : "Article not found"
            })
        } else {
            res.status(200).json({
                error : false,
                message : "Get Article By ID",
                data : 
                [
                    {
                        article : fields
                    }
                ]
            });
        }
    });
});

const postRouteArticles = routes.post('/article' , (req , res)=>{
    const sql = "INSERT INTO article (article_id , judul , penjelasan , link) VALUES(?,?,?,?)";
    const {judul , penjelasan , link} = req.body;
    const articleId = uuidv4();
    db.query(sql , [articleId, judul , penjelasan , link] , (err)=>{
        if (err) {
            res.status(400).json({
                erorr : true,
                message : 'Gagal menambahkan article'
            });
            console.log({judul , penjelasan , link});
        } else{
            
            res.status(200).json({
                error : false,
                message : 'Berhasil menambahkan article'
            });
        };
    });
});




module.exports = {routesArticles , postRouteArticles , getRouteById};