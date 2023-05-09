const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT;

app.listen(() => {
  console.log(`Server is running at port ${port}`);
});
