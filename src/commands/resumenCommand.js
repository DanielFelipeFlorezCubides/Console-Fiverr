import inquirer from 'inquirer';
import chalk from 'chalk';

import { connectDB, client } from '../config/db.js';
import ProyectoRepository from '../repositories/ProyectoRepository.js';
import FinanzaRepository from '../repositories/FinanzaRepository.js';
import FinanzaService from '../services/FinanzaService.js';

const db = await connectDB();
const finanzaService = new FinanzaService(
    new FinanzaRepository(db, client),
    new ProyectoRepository(db)
);

async function mostrarMenuResumen() {
    let salir = false;

    while (!salir) {
        const { accion } = await inquirer.prompt([
            {
                type: 'list',
                name: 'accion',
                message: chalk.cyanBright('¿Qué deseas hacer en el módulo de Resume Financiero?'),
                choices: [
                    { name: '📋 Total Ingresos', value: 'totalIngresos' },
                    { name: '📋 Total Egresos', value: 'totalEgresos' },
                    { name: '📄 Tabla de movimientos', value: 'tabla' },
                    { name: '💰 Calcular balance', value: 'balance' },
                    new inquirer.Separator(),
                    { name: '⬅️ Volver al menú principal', value: 'salir' }
                ]
            }
        ]);

        switch (accion) {
            case "totalIngresos":
                try {
                    const proyectos = await finanzaService.proyectoRepo.listar();
                    if (proyectos.length === 0) {
                        console.log(chalk.red('⚠️ No hay proyectos asociados al cliente.'));
                        break;
                    }

                    const { proyectoId } = await inquirer.prompt([
                        {
                            type: 'list',
                            name: 'proyectoId',
                            message: 'Selecciona el proyecto asociado a tu cliente:',
                            choices: proyectos.map(p => ({
                                name: p.nombre,
                                value: p._id.toString()
                            }))
                        }
                    ]);

                    const ingreso = await finanzaService.obtenerIngresos(proyectoId);
                    const estado = ingreso >= 0 ? chalk.green : chalk.red;
                    console.log(`💰 Ingreso total: ${estado(`$${ingreso.toFixed(2)}`)}`);
                } catch (err) {
                    console.log(chalk.red(`❌ Error al calcular el total de ingresos: ${err.message}`));
                }
                break;

                case "totalEgresos":
                try {
                    const proyectos = await finanzaService.proyectoRepo.listar();
                    if (proyectos.length === 0) {
                        console.log(chalk.red('⚠️ No hay proyectos asociados al cliente.'));
                        break;
                    }

                    const { proyectoId } = await inquirer.prompt([
                        {
                            type: 'list',
                            name: 'proyectoId',
                            message: 'Selecciona el proyecto asociado a tu cliente:',
                            choices: proyectos.map(p => ({
                                name: p.nombre,
                                value: p._id.toString()
                            }))
                        }
                    ]);

                    const egreso = await finanzaService.obtenerEgresos(proyectoId);
                    const estado = egreso >= 0 ? chalk.red : chalk.red;
                    console.log(`💰 Egreso total: ${estado(`$${egreso.toFixed(2)}`)}`);
                } catch (err) {
                    console.log(chalk.red(`❌ Error al calcular el total de ingresos: ${err.message}`));
                }
                break;

                case 'tabla':
                try {
                    const proyectos = await finanzaService.proyectoRepo.listar();

                    if (proyectos.length === 0) {
                        console.log(chalk.red('⚠️ No hay proyectos asociados a tu cliente.'));
                        break;
                    }

                    const { proyectoId } = await inquirer.prompt([
                        {
                            type: 'list',
                            name: 'proyectoId',
                            message: 'Selecciona el proyecto asociado a tu cliente:',
                            choices: proyectos.map(p => ({
                                name: p.nombre,
                                value: p._id.toString()
                            }))
                        }
                    ]);

                    const movimientos = await finanzaService.listarPorProyecto(proyectoId);

                    if (movimientos.length === 0) {
                        console.log(chalk.yellow('📭 No hay movimientos registrados.'));
                        break;
                    }

                    console.log(chalk.yellow('\n📋 Movimientos:\n'));
                    console.table(movimientos.map(m => ({
                        Tipo: m.tipo,
                        Monto: `$${m.monto}`,
                        Descripción: m.descripcion,
                        Fecha: new Date(m.fecha).toISOString().slice(0, 10)
                    })));
                } catch (err) {
                    console.log(chalk.red(`❌ Error: ${err.message}`));
                }
                break;

            case 'balance':
                try {
                    const proyectos = await finanzaService.proyectoRepo.listar();
                    if (proyectos.length === 0) {
                        console.log(chalk.red('⚠️ No hay proyectos asociados al cliente.'));
                        break;
                    }

                    const { proyectoId } = await inquirer.prompt([
                        {
                            type: 'list',
                            name: 'proyectoId',
                            message: 'Selecciona el proyecto asociado a tu cliente:',
                            choices: proyectos.map(p => ({
                                name: p.nombre,
                                value: p._id.toString()
                            }))
                        }
                    ]);

                    const balance = await finanzaService.obtenerBalance(proyectoId);
                    const estado = balance >= 0 ? chalk.green : chalk.red;
                    console.log(`💰 Balance total: ${estado(`$${balance.toFixed(2)}`)}`);
                } catch (err) {
                    console.log(chalk.red(`❌ Error al calcular balance: ${err.message}`));
                }
                break;

                case 'salir':
                salir = true;
                break;
        };
    }
}

export default mostrarMenuResumen;