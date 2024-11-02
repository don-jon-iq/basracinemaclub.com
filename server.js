const express = require('express');
const app = express();
const port = 3122;

const path = require('path');



app.use(express.static(path.join(__dirname, './')));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});