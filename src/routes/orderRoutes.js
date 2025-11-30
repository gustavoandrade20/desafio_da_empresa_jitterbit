const express = require('express');
const router = express.Router();
const controller = require('../controllers/orderController');

/**
 * POST /order
 * Body (entrada do teste):
 * {
 *  "numeroPedido": "v10089015vdb-01",
 *  "valorTotal": 10000,
 *  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
 *  "items": [ { "idItem": "2434", "quantidadeItem": 1, "valorItem": 1000 } ]
 * }
 *
 * O controller faz o mapping e persiste no banco.
 */
router.post('/', controller.createOrder);

// GET /order/list
router.get('/list', controller.listOrders);

// GET /order/:id
router.get('/:id', controller.getOrderById);

// PUT /order/:id
router.put('/:id', controller.updateOrder);

// DELETE /order/:id
router.delete('/:id', controller.deleteOrder);

module.exports = router;
