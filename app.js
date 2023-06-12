const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 8000;
const routes = require('./routes/routes');
//declare db , bodyParser
app.use(express.json());
app.use(bodyParser.json());
// endpoint routes
app.get('/' ,(req , res)=>{
    res.status(302)
    .setHeader("Location","https://documenter.getpostman.com/view/26386351/2s93sc3Bj8")
    .end();
});


app.use(routes);



//Running server
app.listen(port , console.log(`Server berjalan pada localhost:${port}`));
