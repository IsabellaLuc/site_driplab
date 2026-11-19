const Usuario = require('./Usuario');
const Produto = require('./Produto');
const Pedido = require('./Pedido');
const ItemPedido = require('./ItemPedido');

// Relacionamentos principais
Usuario.hasMany(Pedido, { foreignKey: 'usuario_id' });
Pedido.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Pedido.hasMany(ItemPedido, { foreignKey: 'pedido_id', onDelete: 'CASCADE' });
ItemPedido.belongsTo(Pedido, { foreignKey: 'pedido_id' });
Produto.hasMany(ItemPedido, { foreignKey: 'produto_id' });
ItemPedido.belongsTo(Produto, { foreignKey: 'produto_id' });

module.exports = {
    Usuario, Produto, Pedido, ItemPedido,
};
