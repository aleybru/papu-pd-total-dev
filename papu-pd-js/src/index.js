const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const chatRouter = require('./chat');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', chatRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🔥 PapuPD JS server running at http://localhost:${PORT}`);
});
