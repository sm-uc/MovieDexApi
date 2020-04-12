const express = require('express');
require('dotenv').config();
const morgan = require("morgan");
const helmet = require('helmet');
const cors = require("cors");
const movies = require('./movies.js');
const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(function validateBearerToken(req,res,next){
    const request_token = req.get("Authorization").split(" ")[1];
    const api_token = process.env.API_TOKEN;
    if(request_token !== api_token){
        res.status(401).send({error:"Unauthorized access"});
    }
    next();
});

app.get('/movies' ,(req,res) => {
    let response = movies;
   
    if(req.query.avg_vote){
        let vote = Number(req.query.avg_vote);
        if(isNaN(vote)){
            res.status(400).send("Vote should be a number");
        }
        response = response.filter(movie => movie.avg_vote >= vote);
    }
    if(req.query.genre){
         response = response.filter(movie => movie.genre.toLowerCase().includes(req.query.genre.toLowerCase()));

    }
    if(req.query.country){
        response = response.filter(movie => movie.country.toLowerCase().includes(req.query.country.toLowerCase()));

    }
    res.json(response);
});


module.exports  = app;






