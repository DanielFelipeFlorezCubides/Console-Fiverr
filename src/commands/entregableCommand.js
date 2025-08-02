import inquirer from 'inquirer';
import chalk from 'chalk';

import { connectDB, client } from '../config/db.js';
import EntregableRepository from '../repositories/EntregableRepository.js';
import ProyectoRepository from '../repositories/ProyectoRepository.js';
import EntregableService from '../services/EntregableService.js';

const db = await connectDB();
const entregableRepo = new EntregableRepository(db, client);
const proyectoRepo = new ProyectoRepository(db);
const entregableService = new EntregableService(entregableRepo, proyectoRepo);

async function mostrarMenuEntregables() {
  let salir = false;

  while (!salir) {
    const { accion } = await inquirer.prompt([
      {
        type: 'list',
        name: 'accion',
        message: chalk.cyanBright('¿Qué deseas hacer con los entregables?'),
        choices: [
          { name: '🆕 Crear entregable', value: 'crear' },
          { name: '📋 Listar entregables por proyecto', value: 'listar' },
          { name: '🔁 Cambiar estado de un entregable', value: 'cambiarEstado' },
          { name: '🗑️ Eliminar entregable', value: 'eliminar' },
          new inquirer.Separator(),
          { name: '⬅️ Volver al menú principal', value: 'salir' }
        ]
      }
    ]);

    switch (accion) {
      case 'crear':
        try {
          const proyectos = await proyectoRepo.listar();
          if (proyectos.length === 0) {
            console.log(chalk.red('⚠️ No hay proyectos registrados.'));
            break;
          }

          const { proyectoId } = await inquirer.prompt([
            {
              type: 'list',
              name: 'proyectoId',
              message: 'Selecciona el proyecto:',
              choices: proyectos.map(p => ({
                name: `${p.nombre} | Estado: ${p.estado}`,
                value: p._id.toString()
              }))
            }
          ]);

          const { descripcion, fechaLimite } = await inquirer.prompt([
            {
              name: 'descripcion',
              message: 'Descripción del entregable:',
              validate: val => val.trim() !== '' || 'La descripción es obligatoria.'
            },
            {
              name: 'fechaLimite',
              message: 'Fecha límite (YYYY-MM-DD):',
              validate: val => !isNaN(Date.parse(val)) || 'Fecha inválida.'
            }
          ]);

          const id = await entregableService.crearEntregable({
            proyectoId,
            descripcion,
            fechaLimite
          });

          console.log(chalk.green(`✅ Entregable creado con ID: ${id}`));
        } catch (err) {
          console.log(chalk.red(`❌ Error al crear entregable: ${err.message}`));
        }
        break;

      case 'listar':
        try {
          const proyectos = await proyectoRepo.listar();
          if (proyectos.length === 0) {
            console.log(chalk.red('⚠️ No hay proyectos.'));
            break;
          }

          const { proyectoId } = await inquirer.prompt([
            {
              type: 'list',
              name: 'proyectoId',
              message: 'Selecciona un proyecto:',
              choices: proyectos.map(p => ({
                name: `${p.nombre}`,
                value: p._id.toString()
              }))
            }
          ]);

          const entregables = await entregableService.listarPorProyecto(proyectoId);

          if (entregables.length === 0) {
            console.log(chalk.yellow('📭 Este proyecto no tiene entregables.'));
            break;
          }

          console.log(chalk.yellow.bold('\n📋 Entregables:\n'));
          console.table(entregables.map(e => ({
            ID: e._id.toString(),
            Descripción: e.descripcion,
            Estado: e.estado,
            'Fecha límite': new Date(e.fechaLimite).toISOString().slice(0, 10)
          })));
        } catch (err) {
          console.log(chalk.red(`❌ Error al listar: ${err.message}`));
        }
        break;

      case 'cambiarEstado':
        try {
          const entregables = await entregableRepo.collection.find().toArray();

          if (entregables.length === 0) {
            console.log(chalk.red('⚠️ No hay entregables.'));
            break;
          }

          const { entregableId } = await inquirer.prompt([
            {
              type: 'list',
              name: 'entregableId',
              message: 'Selecciona un entregable:',
              choices: entregables.map(e => ({
                name: `${e.descripcion} | Estado: ${e.estado}`,
                value: e._id.toString()
              }))
            }
          ]);

          const { nuevoEstado } = await inquirer.prompt([
            {
              type: 'list',
              name: 'nuevoEstado',
              message: 'Nuevo estado:',
              choices: ['pendiente', 'entregado', 'aprobado', 'rechazado']
            }
          ]);

          const result = await entregableService.cambiarEstado(entregableId, nuevoEstado);

          console.log(result
            ? chalk.green('✅ Estado actualizado con transacción.')
            : chalk.red('❌ Error al cambiar estado.'));
        } catch (err) {
          console.log(chalk.red(`❌ Error: ${err.message}`));
        }
        break;

      case 'eliminar':
        try {
          const entregables = await entregableRepo.collection.find().toArray();

          if (entregables.length === 0) {
            console.log(chalk.red('⚠️ No hay entregables.'));
            break;
          }

          const { entregableId } = await inquirer.prompt([
            {
              type: 'list',
              name: 'entregableId',
              message: 'Selecciona el entregable a eliminar:',
              choices: entregables.map(e => ({
                name: `${e.descripcion} | Estado: ${e.estado}`,
                value: e._id.toString()
              }))
            }
          ]);

          const confirmar = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'confirmado',
              message: '¿Estás seguro?',
              default: false
            }
          ]);

          if (!confirmar.confirmado) {
            console.log(chalk.yellow('❎ Cancelado.'));
            break;
          }

          const eliminado = await entregableService.eliminarEntregable(entregableId);
          console.log(eliminado
            ? chalk.green('🗑️ Entregable eliminado con transacción.')
            : chalk.red('❌ No se pudo eliminar.'));
        } catch (err) {
          console.log(chalk.red(`❌ Error al eliminar: ${err.message}`));
        }
        break;

      case 'salir':
        salir = true;
        break;
    }
  }
}

export default mostrarMenuEntregables;