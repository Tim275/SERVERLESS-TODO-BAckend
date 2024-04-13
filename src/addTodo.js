"use strict"; 

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const serverless = require("serverless-http");
const express = require("express");
const app = express();

AWS.config.update({ region: "eu-central-1" });

const cors = require('cors');
app.use(cors());

app.use(express.json());

app.post('/addTodo', async (req, res) => {
  const { todo } = req.body;
  const userId = req.apiGateway.event.requestContext.authorizer.claims.sub;

  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JavaScript
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  const createdAt = `${year}-${month}-${day}; ${hours}:${minutes}:${seconds}`;

  const id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER); // generates a random number

  const newTodo = {
    id,
    userId, // add the user ID to the todo
    todo,
    createdAt,
    completed: true
  }

  await dynamodb.put({
    TableName: "NewTodoTable",
    Item: newTodo
  }).promise();
  
  res.status(200).json(newTodo);
});

module.exports.handler = serverless(app);