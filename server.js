import express from 'express';
import UserQueries from './src/controllers/UserQueries';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  return res.status(200).send({ message: 'Welcome' });
});

// Setup request method, endpoint URLs and relevant functions
app.get('/users', UserQueries.getUsers);
app.post('/signup', UserQueries.createUser);
app.post('/login', UserQueries.loginUser);
app.put('/users', UserQueries.updateUser);

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
