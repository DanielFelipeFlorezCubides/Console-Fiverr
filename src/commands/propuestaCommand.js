import inquirer from 'inquirer';
import chalk from 'chalk';

import { connectDB } from '../config/db.js';

import Propuesta from '../models/Propuesta.js';
import PropuestaRepository from '../repositories/PropuestaRepository.js';
import PropuestaService from '../services/PropuestaService.js';

import ClienteRepository from '../repositories/ClienteRepository.js';
import ProyectoRepository from '../repositories/ProyectoRepository.js';
import ProyectoService from '../services/ProyectoService.js';

// Conexiones e instancias
const db = await connectDB();
const propuestaService = new PropuestaService(new PropuestaRepository(db));
const clienteRepo = new ClienteRepository(db);
const proyectoService = new ProyectoService(new ProyectoRepository(db));

async function mostrarMenuPropuestas() {
  let salir = false;

  while (!salir) {
    const { accion } = await inquirer.prompt([
      {
        type: 'list',
        name: 'accion',
        message: chalk.cyanBright('¿Qué deseas hacer con las propuestas?'),
        choices: [
          { name: '📄 Listar propuestas', value: 'listar' },
          { name: '🆕 Crear nueva propuesta', value: 'crear' },
          { name: '✏️ Editar propuesta', value: 'editar' },
          { name: '🗑️ Eliminar propuesta', value: 'eliminar' },
          new inquirer.Separator(),
          { name: '⬅️ Volver al menú principal', value: 'salir' }
        ]
      }
    ]);

    switch (accion) {
      case 'listar':
        try {
          const propuestas = await propuestaService.listarPropuestas();
          if (propuestas.length === 0) {
            console.log(chalk.yellow('⚠️ No hay propuestas registradas.'));
            break;
          }

          const clientes = await clienteRepo.listar();
          const tabla = propuestas.map(p => {
            const cliente = clientes.find(c => c._id.toString() === p.clienteId);
            return {
              ID: p._id.toString(),
              Cliente: cliente ? cliente.nombre : p.clienteId,
              Descripción: p.descripcion,
              Precio: `$${p.precio.toFixed(2)}`,
              Plazo: `${p.plazoDias} días`,
              Estado: p.estado
            };
          });

          console.log(chalk.yellow.bold('\n📋 Lista de Propuestas:\n'));
          console.table(tabla);
        } catch (err) {
          console.log(chalk.red(`❌ Error al listar propuestas: ${err.message}`));
        }
        break;

      case 'crear':
        try {
          const clientes = await clienteRepo.listar();
          if (clientes.length === 0) {
            console.log(chalk.red('⚠️ No hay clientes registrados.'));
            break;
          }

          const { clienteId } = await inquirer.prompt([
            {
              type: 'list',
              name: 'clienteId',
              message: 'Selecciona el cliente:',
              choices: clientes.map(c => ({
                name: `${c.nombre} (${c.email})`,
                value: c._id.toString()
              }))
            }
          ]);

          const datosPropuesta = await inquirer.prompt([
            { name: 'descripcion', message: 'Descripción de la propuesta:' },
            {
              name: 'precio',
              message: 'Precio acordado (USD):',
              validate: val => isNaN(val) || Number(val) <= 0 ? 'Debe ser un número válido' : true,
              filter: Number
            },
            {
              name: 'plazoDias',
              message: 'Plazo (en días):',
              validate: val => isNaN(val) || Number(val) <= 0 ? 'Debe ser un número válido' : true,
              filter: Number
            }
          ]);

          const propuestaData = {
            clienteId,
            ...datosPropuesta,
            estado: 'pendiente'
          };

          const id = await propuestaService.crearPropuesta(propuestaData);
          console.log(chalk.green(`✅ Propuesta creada con ID: ${id}`));
        } catch (err) {
          console.log(chalk.red(`❌ Error: ${err.message}`));
        }
        break;

      case 'editar':
        try {
          const propuestas = await propuestaService.listarPropuestas();
          if (propuestas.length === 0) {
            console.log(chalk.red('⚠️ No hay propuestas para editar.'));
            break;
          }

          const { propuestaSeleccionada } = await inquirer.prompt([
            {
              type: 'list',
              name: 'propuestaSeleccionada',
              message: 'Selecciona una propuesta para editar:',
              choices: propuestas.map(p => ({
                name: `${p.descripcion} | Estado: ${p.estado}`,
                value: p._id.toString()
              }))
            }
          ]);

          const propuestaActual = await propuestaService.repo.buscarPorId(propuestaSeleccionada);

          const nuevosDatos = await inquirer.prompt([
            {
              name: 'descripcion',
              message: `Descripción [${propuestaActual.descripcion}]:`,
              default: propuestaActual.descripcion
            },
            {
              name: 'precio',
              message: `Precio [${propuestaActual.precio}]:`,
              default: propuestaActual.precio,
              filter: Number
            },
            {
              name: 'plazoDias',
              message: `Plazo en días [${propuestaActual.plazoDias}]:`,
              default: propuestaActual.plazoDias,
              filter: Number
            },
            {
              type: 'list',
              name: 'estado',
              message: 'Estado de la propuesta:',
              choices: ['pendiente', 'aceptada', 'rechazada'],
              default: propuestaActual.estado
            }
          ]);

          const fueActualizada = await propuestaService.repo.actualizar(
            propuestaSeleccionada,
            nuevosDatos
          );

          if (fueActualizada) {
            console.log(chalk.green('✅ Propuesta actualizada.'));

            if (
              nuevosDatos.estado === 'aceptada' &&
              propuestaActual.estado !== 'aceptada'
            ) {
              const nuevaPropuesta = {
                ...propuestaActual,
                ...nuevosDatos,
                _id: propuestaSeleccionada
              };

              const proyectoId = await proyectoService.crearDesdePropuesta(nuevaPropuesta);
              console.log(chalk.green(`🏗️ Proyecto creado automáticamente con ID: ${proyectoId}`));
            }
          } else {
            console.log(chalk.red('❌ No se pudo actualizar la propuesta.'));
          }
        } catch (err) {
          console.log(chalk.red(`❌ Error al editar propuesta: ${err.message}`));
        }
        break;

      case 'eliminar':
        try {
          const propuestas = await propuestaService.listarPropuestas();
          if (propuestas.length === 0) {
            console.log(chalk.red('⚠️ No hay propuestas para eliminar.'));
            break;
          }

          const { propuestaAEliminar } = await inquirer.prompt([
            {
              type: 'list',
              name: 'propuestaAEliminar',
              message: 'Selecciona una propuesta para eliminar:',
              choices: propuestas.map(p => ({
                name: `${p.descripcion} | Estado: ${p.estado}`,
                value: p._id.toString()
              }))
            }
          ]);

          const { confirmarEliminacion } = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'confirmarEliminacion',
              message: '¿Estás seguro de que deseas eliminar esta propuesta?',
              default: false
            }
          ]);

          if (confirmarEliminacion) {
            const eliminado = await propuestaService.repo.eliminar(propuestaAEliminar);
            console.log(eliminado
              ? chalk.green('🗑️ Propuesta eliminada exitosamente.')
              : chalk.red('❌ No se pudo eliminar la propuesta.'));
          } else {
            console.log(chalk.yellow('❎ Operación cancelada.'));
          }
        } catch (err) {
          console.log(chalk.red(`❌ Error al eliminar propuesta: ${err.message}`));
        }
        break;

      case 'salir':
        salir = true;
        break;
    }
  }
}

export default mostrarMenuPropuestas;