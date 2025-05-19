require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const mercadopago = require('mercadopago');
const Inscripcion = require('./models/Inscripcion');

const PORT = process.env.PORT || 3000;


const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'https://dhtimeeventos.web.app',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

app.options('*', cors()); // Manejo explícito de preflight
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
});

app.post('/crear-preferencia', async (req, res) => {
  const { carrera, ...usuario } = req.body;

  const preference = {
    items: [{
      title: `Inscripción a ${carrera.nombre}`,
      unit_price: Number(carrera.precio),
      quantity: 1,
    }],
    back_urls: {
      success: 'https://dhtimeeventos.web.app/success.html',
      failure: 'https://dhtimeeventos.web.app/failure.html',
    },
    auto_return: 'approved',
    metadata: { ...usuario, carreraId: carrera.id }
  };

  try {
    const result = await mercadopago.preferences.create(preference);
    console.log('Preferencia creada:', result.body);
    res.json({ init_point: result.body.init_point });
  } catch (err) {
    console.error('Error al crear preferencia:', err.response?.data || err.message);
    res.status(500).json({ error: 'Error al crear preferencia' });
  }
});

app.post('/webhook', async (req, res) => {
  try {
    const payment = await mercadopago.payment.findById(req.body.data.id);
    const metadata = payment.body.metadata;

    if (payment.body.status === 'approved') {
      await Inscripcion.create({
        ...metadata,
        pagoId: payment.body.id,
      });
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('Error en webhook:', err);
    res.sendStatus(500);
  }
});

app.listen(PORT, () => console.log(`Backend escuchando en puerto ${PORT}`));