-- Banco de dados DRIPLAB
-- Estrutura baseada nos modelos Sequelize do projeto enviado.
-- Execute este arquivo no MySQL Workbench ou em um cliente MySQL.

CREATE DATABASE IF NOT EXISTS driplab_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE driplab_db;

CREATE TABLE IF NOT EXISTS Usuario (
  id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(120) NOT NULL,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(180) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  senha VARCHAR(255) NOT NULL,
  tipo ENUM('cliente', 'administrador') NOT NULL DEFAULT 'cliente',
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY usuarios_username_unique (username),
  UNIQUE KEY usuarios_email_unique (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS Produto (
  id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(160) NOT NULL,
  descricao TEXT NULL,
  preco DECIMAL(10,2) NOT NULL,
  imagem VARCHAR(500) NULL,
  categoria VARCHAR(80) NOT NULL,
  tamanho ENUM('P', 'M', 'G', 'GG', 'XG') NULL,
  cor VARCHAR(60) NULL,
  estoque INT NOT NULL DEFAULT 0,
  ativo TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS Pedido (
  id INT NOT NULL AUTO_INCREMENT,
  usuario_id INT NULL,
  status ENUM('pendente', 'confirmado', 'enviado', 'entregue', 'cancelado') NOT NULL DEFAULT 'pendente',
  total DECIMAL(10,2) NOT NULL,
  endereco_entrega TEXT NOT NULL,
  forma_pagamento ENUM('pix', 'cartao', 'boleto', 'outro') NOT NULL DEFAULT 'outro',
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY pedido_usuario_id_idx (usuario_id),
  CONSTRAINT pedido_usuario_fk FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ItemPedido (
  id INT NOT NULL AUTO_INCREMENT,
  pedido_id INT NULL,
  produto_id INT NULL,
  quantidade INT NOT NULL,
  preco_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY itempedido_pedido_id_idx (pedido_id),
  KEY itempedido_produto_id_idx (produto_id),
  CONSTRAINT itempedido_pedido_fk FOREIGN KEY (pedido_id) REFERENCES Pedido(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT itempedido_produto_fk FOREIGN KEY (produto_id) REFERENCES Produto(id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- O cadastro de produtos pode ser feito pela API/área administrativa.
-- Nenhuma conta de usuário ou senha foi criada neste script.
