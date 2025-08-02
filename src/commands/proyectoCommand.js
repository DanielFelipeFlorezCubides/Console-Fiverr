import inquirer from 'inquirer';
import chalk from 'chalk';

import { connectDB } from '../config/db.js';
import ProyectoRepository from '../repositories/ProyectoRepository.js';
import ProyectoService from '../services/ProyectoService.js';
import ClienteRepository from '../repositories/ClienteRepository.js';

const db = await connectDB();
const proyectoService = new ProyectoService(new ProyectoRepository(db));
const clienteRepo = new ClienteRepository(db);

async function mostrarMenuProyectos() {
    let salir = false;

    while (!salir) {
        const { accion } = await inquirer.prompt([
            {
                type: 'list',
                name: 'accion',
                message: chalk.cyanBright('¿Qué deseas hacer con los proyectos?'),
                choices: [
                    { name: '📄 Listar proyectos', value: 'listar' },
                    { name: '🔁 Cambiar estado de un proyecto', value: 'cambiarEstado' },
                    { name: '📝 Registrar avance en un proyecto', value: 'agregarAvance' },
                    { name: '📋 Ver avances de un proyecto', value: 'verAvances' },
                    new inquirer.Separator(),
                    { name: '⬅️ Volver al menú principal', value: 'salir' }
                ]
            }
        ]);

        switch (accion) {
            case 'listar':
                try {
                    const proyectos = await proyectoService.listarProyectos();
                    if (proyectos.length === 0) {
                        console.log(chalk.yellow('⚠️ No hay proyectos registrados.'));
                        break;
                    }

                    const clientes = await clienteRepo.listar();

                    const tabla = proyectos.map(p => {
                        const cliente = clientes.find(c => c._id.toString() === p.clienteId);
                        return {
                            ID: p._id.toString(),
                            Cliente: cliente ? cliente.nombre : p.clienteId,
                            Nombre: p.nombre,
                            Estado: p.estado,
                            Avances: p.avances?.length || 0
                        };
                    });

                    console.log(chalk.yellow.bold('\n📋 Lista de Proyectos:\n'));
                    console.table(tabla);
                } catch (err) {
                    console.log(chalk.red(`❌ Error al listar proyectos: ${err.message}`));
                }
                break;

            case 'cambiarEstado':
                try {
                    const proyectos = await proyectoService.listarProyectos();
                    if (proyectos.length === 0) {
                        console.log(chalk.red('⚠️ No hay proyectos disponibles.'));
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

                    const { nuevoEstado } = await inquirer.prompt([
                        {
                            type: 'list',
                            name: 'nuevoEstado',
                            message: 'Selecciona el nuevo estado:',
                            choices: ['activo', 'pausado', 'finalizado', 'cancelado']
                        }
                    ]);

                    const actualizado = await proyectoService.cambiarEstadoProyecto(proyectoId, nuevoEstado);
                    console.log(actualizado
                        ? chalk.green('✅ Estado actualizado correctamente.')
                        : chalk.red('❌ No se pudo actualizar el estado.'));

                } catch (err) {
                    console.log(chalk.red(`❌ Error al cambiar estado: ${err.message}`));
                }
                break;

            case 'agregarAvance':
                try {
                    const proyectos = await proyectoService.listarProyectos();
                    if (proyectos.length === 0) {
                        console.log(chalk.red('⚠️ No hay proyectos para registrar avances.'));
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

                    const { avance } = await inquirer.prompt([
                        {
                            type: 'input',
                            name: 'avance',
                            message: 'Escribe el avance que deseas registrar:'
                        }
                    ]);

                    const registrado = await proyectoService.agregarAvance(proyectoId, avance);
                    console.log(registrado
                        ? chalk.green('✅ Avance registrado correctamente.')
                        : chalk.red('❌ No se pudo registrar el avance.'));

                } catch (err) {
                    console.log(chalk.red(`❌ Error al registrar avance: ${err.message}`));
                }
                break;

            case 'verAvances':
                try {
                    const proyectos = await proyectoService.listarProyectos();
                    if (proyectos.length === 0) {
                        console.log(chalk.red('⚠️ No hay proyectos para revisar.'));
                        break;
                    }

                    const { proyectoId } = await inquirer.prompt([
                        {
                            type: 'list',
                            name: 'proyectoId',
                            message: 'Selecciona un proyecto para ver sus avances:',
                            choices: proyectos.map(p => ({
                                name: `${p.nombre} | Estado: ${p.estado}`,
                                value: p._id.toString()
                            }))
                        }
                    ]);

                    const proyecto = await proyectoService.buscarPorId(proyectoId);

                    if (!proyecto || !proyecto.avances || proyecto.avances.length === 0) {
                        console.log(chalk.yellow('⚠️ Este proyecto no tiene avances registrados aún.'));
                    } else {
                        console.log(chalk.green.bold(`\n📋 Avances del Proyecto "${proyecto.nombre}":\n`));
                        proyecto.avances.forEach((avance, i) => {
                            console.log(chalk.cyan(`${i + 1}.`) + ` ${avance}`);
                        });
                    }

                } catch (err) {
                    console.log(chalk.red(`❌ Error al obtener avances: ${err.message}`));
                }
                break;

            case 'salir':
                salir = true;
                break;
        }
    }
}

export default mostrarMenuProyectos;