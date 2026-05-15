let productos = JSON.parse(localStorage.getItem('inventarioFlor')) || [
  {
    id: 1,
    nombre: 'Rosa Roja',
    categoria: 'Flores',
    stock: 50,
    minimo: 10
  },
  {
    id: 2,
    nombre: 'Girasol',
    categoria: 'Flores',
    stock: 5,
    minimo: 10
  }
];

function guardarDatos() {
  localStorage.setItem('inventarioFlor', JSON.stringify(productos));
}

function renderizarProductos() {
  const tabla = document.getElementById('tablaProductos');
  tabla.innerHTML = '';

  let stockBajo = 0;
  let totalUnidades = 0;

  productos.forEach(producto => {
    totalUnidades += producto.stock;

    const bajo = producto.stock <= producto.minimo;

    if (bajo) stockBajo++;

    tabla.innerHTML += `
          <tr>
            <td>${producto.nombre}</td>
            <td>${producto.categoria}</td>
            <td class="${bajo ? 'low-stock' : ''}">${producto.stock}</td>
            <td>${producto.minimo}</td>
            <td>
              ${bajo
        ? '<span class="low-stock">Stock Bajo</span>'
        : 'Disponible'}
            </td>
            <td>
              <div class="actions">
                <button class="edit-btn" onclick="editarProducto(${producto.id})">Editar</button>
                <button class="delete-btn" onclick="eliminarProducto(${producto.id})">Eliminar</button>
              </div>
            </td>
          </tr>
        `;
  });

  document.getElementById('totalProductos').textContent = productos.length;
  document.getElementById('stockBajo').textContent = stockBajo;
  document.getElementById('totalUnidades').textContent = totalUnidades;

  guardarDatos();
}

function agregarProducto() {
  const nombre = document.getElementById('nombre').value.trim();
  const categoria = document.getElementById('categoria').value;
  const stock = parseInt(document.getElementById('stock').value);
  const minimo = parseInt(document.getElementById('minimo').value);

  if (!nombre || isNaN(stock) || isNaN(minimo)) {
    alert('Completa todos los campos');
    return;
  }

  productos.push({
    id: Date.now(),
    nombre,
    categoria,
    stock,
    minimo
  });

  document.getElementById('nombre').value = '';
  document.getElementById('stock').value = '';
  document.getElementById('minimo').value = '';

  renderizarProductos();
}

function eliminarProducto(id) {
  productos = productos.filter(producto => producto.id !== id);
  renderizarProductos();
}

let productoEditando = null;

function editarProducto(id) {
  const producto = productos.find(p => p.id === id);

  productoEditando = producto;

  document.getElementById('editNombre').value = producto.nombre;
  document.getElementById('editStock').value = producto.stock;

  document.getElementById('modalEditar').style.display = 'flex';
}

function guardarProductoEditado() {
  productoEditando.nombre =
    document.getElementById('editNombre').value;

  productoEditando.stock =
    parseInt(document.getElementById('editStock').value);

  document.getElementById('modalEditar').style.display = 'none';

  renderizarProductos();
}

function cerrarModalEditar() {
  document.getElementById('modalEditar').style.display = 'none';
}

renderizarProductos();

window.editarProducto = editarProducto;
window.eliminarProducto = eliminarProducto;
window.agregarProducto = agregarProducto;