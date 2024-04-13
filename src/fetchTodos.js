"use strict"; 

const AWS = require('aws-sdk');
const serverless = require("serverless-http");
const express = require("express");
const app = express();
const cors = require('cors');
app.use(cors());
AWS.config.update({ region: "eu-central-1" });
const dynamodb = new AWS.DynamoDB.DocumentClient();

app.get('/fetchTodos', async (req, res) => {
  const todos = await dynamodb.scan({ TableName: "NewTodoTable" }).promise();

  res.status(200).json(todos.Items);
});

module.exports.handler = serverless(app);

