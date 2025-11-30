require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');

const orderRoutes = require('./src/routes/orderRoutes');
const { errorHandler } = require('./src/utils/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


app.use('/order', orderRoutes);

app.get('/', (req, res) => res.json({ status: 'ok', service: 'order-api' }));

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ordersdb';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('MongoDB conectado');
    app.listen(PORT, () => {
      console.log(`API rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Erro ao conectar no MongoDB:', err.message);
    process.exit(1);
  });
