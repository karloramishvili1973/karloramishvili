import express from 'express';

const app = express();
const port = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.send({ status: 'ok', msg: 'DAO backend stub' });
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
