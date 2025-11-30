const Joi = require('joi');
const Order = require('../models/Order');

const requestSchema = Joi.object({
  numeroPedido: Joi.string().required(),
  valorTotal: Joi.number().required(),
  dataCriacao: Joi.string().isoDate().required(),
  items: Joi.array().items(
    Joi.object({
      idItem: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
      quantidadeItem: Joi.number().required(),
      valorItem: Joi.number().required()
    })
  ).required()
});

const mapRequestToOrder = (body) => {
  return {
    orderId: body.numeroPedido,
    value: body.valorTotal,
    creationDate: new Date(body.dataCriacao),
    items: body.items.map(i => ({
      productId: Number(i.idItem),
      quantity: i.quantidadeItem,
      price: i.valorItem
    }))
  };
};

exports.createOrder = async (req, res, next) => {
  try {
    const { error } = requestSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const orderData = mapRequestToOrder(req.body);

    const exists = await Order.findOne({ orderId: orderData.orderId });
    if (exists) return res.status(409).json({ error: 'orderId já existe' });

    const order = new Order(orderData);
    await order.save();
    return res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const order = await Order.findOne({ orderId: id });
    if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });
    return res.json(order);
  } catch (err) {
    next(err);
  }
};

exports.listOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ creationDate: -1 });
    return res.json(orders);
  } catch (err) {
    next(err);
  }
};

exports.updateOrder = async (req, res, next) => {
  try {
    const id = req.params.id;
    let update = req.body;

    if (req.body.numeroPedido || req.body.valorTotal || req.body.items) {
      update = mapRequestToOrder(req.body);
      update.orderId = id;
    }

    const order = await Order.findOneAndUpdate({ orderId: id }, update, { new: true });
    if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });
    return res.json(order);
  } catch (err) {
    next(err);
  }
};

exports.deleteOrder = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await Order.deleteOne({ orderId: id });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Pedido não encontrado' });
    return res.json({ message: 'Pedido deletado com sucesso' });
  } catch (err) {
    next(err);
  }
};
