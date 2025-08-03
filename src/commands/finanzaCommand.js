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

async function mostrarMenuFinanzas() {
    let salir = false;

    while (!salir) {
        const { accion } = await inquirer.prompt([
            {
                type: 'list',
                name: 'accion',
                message: chalk.cyanBright('¿Qué deseas hacer en el módulo de Finanzas?'),
                choices: [
                    { name: '🆕 Registrar ingreso o egreso', value: 'registrar' },
                    { name: '📋 Ver movimientos por proyecto', value: 'verProyecto' },
                    { name: '📆 Ver movimientos por fechas', value: 'verFechas' },
                    { name: '💰 Calcular balance por proyecto', value: 'balance' },
                    { name: '📤 Exportar movimientos a archivo', value: 'exportar' },
                    new inquirer.Separator(),
                    { name: '⬅️ Volver al menú principal', value: 'salir' }
                ]
            }
        ]);

        switch (accion) {
            case 'registrar':
                try {
                    const proyectos = await finanzaService.proyectoRepo.listar();
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
                                name: `${p.nombre} (${p.estado})`,
                                value: p._id.toString()
                            }))
                        }
                    ]);

                    const { tipo, monto, descripcion, fecha } = await inquirer.prompt([
                        {
                            type: 'list',
                            name: 'tipo',
                            message: 'Tipo de movimiento:',
                            choices: ['ingreso', 'egreso']
                        },
                        {
                            name: 'monto',
                            message: 'Monto en USD:',
                            validate: val => Number(val) > 0 || 'Debe ser mayor que cero.',
                            filter: Number
                        },
                        {
                            name: 'descripcion',
                            message: 'Descripción del movimiento:',
                            validate: val => val.trim().length > 0 || 'Obligatorio.'
                        },
                        {
                            name: 'fecha',
                            message: 'Fecha del movimiento (YYYY-MM-DD):',
                            validate: val => !isNaN(Date.parse(val)) || 'Fecha inválida.'
                        }
                    ]);

                    const ok = await finanzaService.registrarMovimiento({
                        proyectoId,
                        tipo,
                        monto,
                        descripcion,
                        fecha
                    });

                    console.log(ok
                        ? chalk.green('✅ Movimiento registrado con éxito.')
                        : chalk.red('❌ No se pudo registrar el movimiento.'));
                } catch (err) {
                    console.log(chalk.red(`❌ Error: ${err.message}`));
                }
                break;

            case 'verProyecto':
                try {
                    const proyectos = await finanzaService.proyectoRepo.listar();

                    if (proyectos.length === 0) {
                        console.log(chalk.red('⚠️ No hay proyectos.'));
                        break;
                    }

                    const { proyectoId } = await inquirer.prompt([
                        {
                            type: 'list',
                            name: 'proyectoId',
                            message: 'Selecciona el proyecto:',
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

            case 'verFechas':
                try {
                    const { inicio, fin } = await inquirer.prompt([
                        {
                            name: 'inicio',
                            message: 'Fecha inicial (YYYY-MM-DD):',
                            validate: v => !isNaN(Date.parse(v)) || 'Fecha inválida.'
                        },
                        {
                            name: 'fin',
                            message: 'Fecha final (YYYY-MM-DD):',
                            validate: v => !isNaN(Date.parse(v)) || 'Fecha inválida.'
                        }
                    ]);

                    const movimientos = await finanzaService.listarPorRango(inicio, fin);

                    if (movimientos.length === 0) {
                        console.log(chalk.yellow('📭 No hay movimientos en ese rango.'));
                        break;
                    }

                    console.log(chalk.yellow('\n📆 Movimientos en rango:\n'));
                    console.table(movimientos.map(m => ({
                        Proyecto: m.proyectoId,
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
                        console.log(chalk.red('⚠️ No hay proyectos.'));
                        break;
                    }

                    const { proyectoId } = await inquirer.prompt([
                        {
                            type: 'list',
                            name: 'proyectoId',
                            message: 'Selecciona el proyecto:',
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
                
            case 'exportar':
                try {
                    const proyectos = await finanzaService.proyectoRepo.listar();
                    if (proyectos.length === 0) {
                        console.log(chalk.red('⚠️ No hay proyectos.'));
                        break;
                    }

                    const { proyectoId } = await inquirer.prompt([
                        {
                            type: 'list',
                            name: 'proyectoId',
                            message: 'Selecciona el proyecto:',
                            choices: proyectos.map(p => ({
                                name: p.nombre,
                                value: p._id.toString()
                            }))
                        }
                    ]);

                    const movimientos = await finanzaService.listarPorProyecto(proyectoId);
                    if (movimientos.length === 0) {
                        console.log(chalk.yellow('📭 Este proyecto no tiene movimientos.'));
                        break;
                    }

                    const { formato } = await inquirer.prompt([
                        {
                            type: 'list',
                            name: 'formato',
                            message: '¿En qué formato quieres exportar?',
                            choices: ['json', 'csv']
                        }
                    ]);

                    const { exportarMovimientos } = await import('../utils/exporter.js');

                    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                    const ruta = await exportarMovimientos({
                        movimientos,
                        formato,
                        nombreArchivo: `movimientos_${proyectoId}_${timestamp}`
                    });

                    console.log(chalk.green(`✅ Exportado correctamente: ${ruta}`));
                } catch (err) {
                    console.log(chalk.red(`❌ Error al exportar: ${err.message}`));
                }
                break;

            case 'salir':
                salir = true;
                break;
        }
    }
}

export default mostrarMenuFinanzas;