CREATE TABLE Clientes (
    id_cliente INT PRIMARY KEY,
    nombre VARCHAR(100),
    telefono VARCHAR(20)
);

CREATE TABLE Pedidos (
    id_pedido INT PRIMARY KEY,
    id_cliente INT,
    fecha DATE,
    estado VARCHAR(50),

    FOREIGN KEY (id_cliente) REFERENCES Clientes(id_cliente)
);

CREATE TABLE Producto(
    id_producto INT PRIMARY KEY, 
    nombre VARCHAR(100)
);

CREATE TABLE Detalle_de_pedido(
    id_detalle INT PRIMARY KEY, 
    id_producto INT,
    id_pedido INT,
    cantidad INT,

    FOREIGN KEY (id_producto) REFERENCES Producto(id_producto),
    FOREIGN KEY (id_pedido) REFERENCES Pedidos(id_pedido)
);

CREATE TABLE local(
    id_local INT PRIMARY KEY, 
    id_pedido INT,
    
    FOREIGN KEY (id_pedido) REFERENCES Pedidos(id_pedido), 
    
    persona_recoger VARCHAR(100), 
    telefono VARCHAR(100)
);

CREATE TABLE Envios(
    id_envio INT PRIMARY KEY, 
    id_pedido INT,

    FOREIGN KEY (id_pedido) REFERENCES Pedidos(id_pedido), 
    
    direccion VARCHAR(200),
    fecha_de_entrega DATE
);