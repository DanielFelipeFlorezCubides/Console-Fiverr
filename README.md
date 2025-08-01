# Console-Fiverr 🎯

Una CLI para freelancers para gestionar clientes, propuestas, proyectos, contratos, entregables y finanzas. 100% Node.js + MongoDB.

## 🧪 Requisitos

- Node.js >= 16
- MongoDB local o en la nube
- npm install

## 🚀 Inicio rápido

```bash
npm install
npm start
```
## 🌱 Estructura

```
/models: Definición de modelos JS
/config: Configuración base (.env, conexión MongoDB)
/commands: Lógica CLI (inquirer)
/services: Lógica de negocio
/utils: Helpers comunes
```

## 🧠 Arquitectura

- Principios SOLID
- MongoDB con driver oficial
- Patrones: Repository, Command

---

### 📄 Modelos base de ejemplo

Aquí va un ejemplo para `models/Cliente.js`, los demás siguen el mismo patrón:

```js
class Cliente {
  constructor({ nombre, email, telefono }) {
    if (!nombre || typeof nombre !== 'string') throw new Error("Nombre inválido");
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) throw new Error("Email inválido");
    if (!telefono || typeof telefono !== 'string') throw new Error("Teléfono inválido");

    this.nombre = nombre;
    this.email = email;
    this.telefono = telefono;
    this.creadoEn = new Date();
  }
}

module.exports = Cliente;
```
