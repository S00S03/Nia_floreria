/**
 * database.js
 * Manejo de la base de datos SQLite (sql.js) y persistencia en localStorage.
 */

let db;

/**
 * Inicializa sql.js, carga la BD desde localStorage (si existe)
 * y crea las tablas necesarias.
 * Llama a renderAll() al terminar.
 */
const SQL = window.initSqlJs({
  locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/${file}`
});

SQL.then(S => {
  const saved = localStorage.getItem('floreria_db');
  if (saved) {
    const buf = Uint8Array.from(atob(saved), c => c.charCodeAt(0));
    db = new S.Database(buf);
  } else {
    db = new S.Database();
  }
  initDB();
  renderAll();
});

/** Serializa y guarda la BD en localStorage. */
function saveDB() {
  const data = db.export();
  const b64 = btoa(String.fromCharCode(...data));
  localStorage.setItem('floreria_db', b64);
}

/** Crea las tablas si no existen e inserta ramos por defecto. */
function initDB() {
  db.run(`
    CREATE TABLE IF NOT EXISTS ramos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS pedidos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente_nombre    TEXT NOT NULL,
      cliente_tel       TEXT NOT NULL,
      ramo              TEXT NOT NULL,
      tipo              TEXT NOT NULL,
      estado            TEXT DEFAULT 'Pendiente',
      pago              TEXT,
      notas             TEXT,
      fecha_pedido      TEXT NOT NULL,
      dir_direccion     TEXT,
      dir_dest_nombre   TEXT,
      dir_dest_tel      TEXT,
      dir_fecha_entrega TEXT,
      dir_horario       TEXT,
      dir_clave         TEXT,
      loc_rec_nombre    TEXT,
      loc_rec_tel       TEXT,
      loc_horario       TEXT
    );
  `);

  // Ramos por defecto (solo si la tabla está vacía)
  const count = db.exec("SELECT COUNT(*) AS c FROM ramos")[0].values[0][0];
  if (count === 0) {
    const defaults = [
      'Ramo de rosas rojas',
      'Ramo de girasoles',
      'Arreglo mixto primaveral',
      'Bouquet de novia',
      'Ramo de lilies',
      'Centro de mesa tropical',
      'Ramo de tulipanes'
    ];
    defaults.forEach(n => db.run("INSERT INTO ramos(nombre) VALUES(?)", [n]));
  }

  saveDB();
}

/**
 * Ejecuta una sentencia SQL y devuelve un array de objetos.
 * @param {string} sql
 * @param {Array}  args - parámetros de la consulta
 * @returns {Object[]}
 */
function execSQL(sql, args = []) {
  try {
    const res = db.exec(sql, args);
    if (!res.length) return [];
    const { columns, values } = res[0];
    return values.map(row => Object.fromEntries(columns.map((c, i) => [c, row[i]])));
  } catch (e) {
    console.error('execSQL error:', e);
    return [];
  }
}