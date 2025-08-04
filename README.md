# 🎛️ Console-Fiverr

**Console-Fiverr** es una aplicación CLI desarrollada en Node.js que permite a freelancers gestionar de forma profesional su portafolio de clientes, proyectos, contratos, entregables y finanzas.

Este proyecto simula una versión terminal de plataformas como Fiverr, adaptada a la gestión autónoma de proyectos freelance, incluyendo control de avances, contratos, registros contables y operaciones seguras con transacciones MongoDB.

---

## 🚀 Descripción del proyecto

Console-Fiverr permite:

- Crear y gestionar clientes y propuestas comerciales
- Gestionar proyectos con estados, avances y entregables
- Asociar contratos a proyectos con condiciones y fechas válidas
- Registrar ingresos y egresos asociados a proyectos
- Calcular balances financieros
- Exportar movimientos financieros a CSV o JSON
- Realizar operaciones críticas dentro de transacciones MongoDB reales

---

## 🧩 Instrucciones de instalación y uso

### 1. Clona el repositorio

```bash
git clone https://github.com/tu_usuario/console-fiverr.git
cd console-fiverr
```

### 2. Instala dependencias

```bash
npm install
```

### 3. Configura el archivo `.env`

Crea un archivo `.env` en la raíz con:

```bash
env

MONGODB_URI=mongodb://localhost:27018/?replicaSet=rs0
DB_NAME=console-fiverr
```

> Asegúrate de tener MongoDB corriendo como **replica set** en el puerto `27018`

### 4. Ejecuta la app

```bash
npm start
```

------

## 📁 Estructura del proyecto

```bash
src/
├── commands/          # Menús interactivos CLI
├── config/            # Configuración de conexión a MongoDB
├── models/            # Validación y estructura de datos
├── repositories/      # Acceso a base de datos (patrón Repository)
├── services/          # Lógica de negocio (patrón Service)
├── utils/             # Utilidades (exportaciones, helpers)
└── index.js           # Menú principal CLI
```

------

## 🧱 Principios SOLID aplicados

| Principio   | Aplicación                                                   |
| ----------- | ------------------------------------------------------------ |
| **S** - SRP | Cada clase tiene una única responsabilidad: CLI, servicio, modelo, repo. |
| **O** - OCP | Es fácil extender servicios (ej. nuevos estados de entregables) sin modificar lógica base |
| **L** - LSP | Las clases como `Contrato`, `Entregable` respetan su contrato esperado |
| **I** - ISP | Los métodos están separados por propósito (listar, crear, eliminar...) |
| **D** - DIP | Los servicios dependen de abstracciones (`repo`) y no de Mongo directamente |



------

## 🧠 Patrones de diseño utilizados

| Patrón            | Implementación                                               |
| ----------------- | ------------------------------------------------------------ |
| **Repository**    | Cada colección tiene su propio repositorio con métodos CRUD y transacciones |
| **Service**       | Encapsula lógica de negocio y validación usando los modelos  |
| (Opcional futuro) | Factory para crear propuestas/proyectos automáticamente      |



------

## ⚙️ Consideraciones técnicas

- Node.js puro (sin frameworks como Express)
- Uso exclusivo del **driver oficial de MongoDB** (sin mongoose)
- Todas las operaciones financieras y entregables usan **transacciones reales**
- Interacción 100% CLI usando `inquirer` y `chalk`
- Exportación de movimientos en `CSV` y `JSON`
- Validaciones por clase (`Entregable`, `Contrato`, etc.) siguiendo orientación a objetos

------

## 👥 Créditos

**Autor**: [Daniel Felipe Florez Cubides]
**Rol**: Backend Developer - Fullstack JS


- [Daniel Felipe Florez Cubides] – Todos los roles scrum

Plantilla creada bajo requerimientos académicos/profesionales para gestión de portafolio freelance.

------

## 🧩 Licencia

Este proyecto es de código abierto y puede ser usado con fines educativos o personales.

## 🎥 Video aclaratorio
https://drive.google.com/file/d/1cqdZ1mrUQvPNVf-xOMinxOT1XeT2I3Ql/view?usp=sharing
