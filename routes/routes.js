const express = require('express');
const { routesArticles, postRouteArticles, getRouteById } = require('../controller/article');
const { createUsers, loginUsers } = require('../controller/users');
const routes = express.Router();

routes.get('/article' , routesArticles );
routes.get('/article/:article_id' , getRouteById);
routes.post('/article' , postRouteArticles);
routes.post('/register' , createUsers);
routes.post('/login',loginUsers);


module.exports = routes;





