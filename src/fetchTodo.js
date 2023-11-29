"use strict"; 

const AWS = require('aws-sdk');
const serverless = require("serverless-http");
const express = require("express");
const app = express();

AWS.config.update({ region: "eu-central-1" });
const dynamodb = new AWS.DynamoDB.DocumentClient();
const cors = require('cors');
app.use(cors());
app.get('/fetchTodo/:id', async (req, res) => {
  const { id } = req.params;
  const todo = await dynamodb.get({ 
    TableName: "NewTodoTable", 
    Key: { id: Number(id) } 
  }).promise();

  res.status(200).json(todo.Item);
});

module.exports.handler = serverless(app);