"use strict"; 

const AWS = require('aws-sdk');
const serverless = require("serverless-http");
const express = require("express");
const app = express();
const cors = require('cors');

AWS.config.update({ region: "eu-central-1" });
const dynamodb = new AWS.DynamoDB.DocumentClient();

app.use(express.json());
app.use(cors());

app.put('/updateCompleted/:id', async (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
  
    let updateExpression = 'set #completed = :completed';
    let ExpressionAttributeNames = { '#completed': 'completed' };
    let ExpressionAttributeValues = { ':completed': completed };
  
    const params = {
      TableName: "NewTodoTable", 
      Key: { id: Number(id) },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: ExpressionAttributeNames,
      ExpressionAttributeValues: ExpressionAttributeValues,
      ReturnValues: "ALL_NEW"
    };
  
    try {
      const data = await dynamodb.update(params).promise();
      res.json({ success: true, message: 'Todo updated', data });
    } catch (error) {
      console.error('Error updating todo:', error);
      res.json({ success: false, message: 'Error updating todo' });
    }
  });
  
  module.exports.handler = serverless(app);