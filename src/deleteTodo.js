"use strict"; 

const AWS = require('aws-sdk');
const serverless = require("serverless-http");
const express = require("express");
const app = express();

AWS.config.update({ region: "eu-central-1" });
const dynamodb = new AWS.DynamoDB.DocumentClient();
const cors = require('cors');
app.use(cors());

app.delete('/deleteTodo/:id', async (req, res) => {
  const { id } = req.params;

  // Check if id is a valid number
  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }

  try {
    await dynamodb.delete({ 
      TableName: "NewTodoTable", 
      Key: { id: Number(id) } 
    }).promise();

    res.status(200).json({ 
      message: `Todo with ID: ${id} deleted successfully`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting todo' });
  }
});
module.exports.handler = serverless(app);