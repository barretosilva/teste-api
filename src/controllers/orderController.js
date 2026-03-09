const Order = require('../models/Order');
const mapPayloadToModel = (payload) => {
  return {
    orderId: payload.numeroPedido,
    value: payload['valor Total'] || payload.valorTotal,
    creationDate: new Date(payload.dataCriacao || payload['data Criacao']),
    items: payload.items.map(item => ({
      productId: Number(item.idItem || item.idltem), 
      quantity: Number(item.quantidadeItem || item.quantidadeltem),
      price: Number(item.valorItem || item.valorltem)
    }))
  };
};

exports.createOrder = async (req, res) => {
  try {
    const mappedData = mapPayloadToModel(req.body);
    
    const orderExists = await Order.findOne({ orderId: mappedData.orderId });
    if (orderExists) {
      return res.status(400).json({ error: 'Um pedido com este ID já existe.' });
    }

    const order = await Order.create(mappedData);
    return res.status(201).json(order);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao criar pedido.', details: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ error: 'Pedido não encontrado.' });
    
    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar pedido.', details: error.message });
  }
};

exports.listOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao listar pedidos.' });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    let updateData = req.body;
    if (req.body.numeroPedido) {
      updateData = mapPayloadToModel(req.body);
    }

    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!order) return res.status(404).json({ error: 'Pedido não encontrado para atualização.' });
    
    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao atualizar pedido.', details: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ error: 'Pedido não encontrado para exclusão.' });
    
    return res.status(200).json({ message: 'Pedido deletado com sucesso.' });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao deletar pedido.', details: error.message });
  }
};