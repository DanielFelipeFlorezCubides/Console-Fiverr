import inquirer from 'inquirer';
import chalk from 'chalk';

import { connectDB } from '../config/db.js';
import ContratoRepository from '../repositories/ContratoRepository.js';
import ContratoService from '../services/ContratoService.js';
import ProyectoRepository from '../repositories/ProyectoRepository.js';

const db = await connectDB();
const contratoService = new ContratoService(
    new ContratoRepository(db),
    new ProyectoRepository(db)
);

async function mostrarMenuContratos() {
    let salir = false;

    while (!salir) {
        const { accion } = await inquirer.prompt([
            {
                type: 'list',
                name: 'accion',
                message: chalk.cyanBright('¿Qué deseas hacer con los contratos?'),
                choices: [
                    { name: '📄 Listar contratos', value: 'listar' },
                    { name: '🆕 Crear contrato', value: 'crear' },
                    { name: '🔍 Ver detalle de contrato', value: 'verDetalle' },
                    new inquirer.Separator(),
                    { name: '⬅️ Volver al menú principal', value: 'salir' }
                ]
            }
        ]);

        switch (accion) {
            case 'crear':
                try {
                    const proyectoRepo = new ProyectoRepository(db);
                    const proyectos = await proyectoRepo.listar();
                    const contratos = await contratoService.listarContratos();
                    const proyectosConContrato = new Set(contratos.map(c => c.proyectoId));

                    const disponibles = proyectos.filter(
                        p => !proyectosConContrato.has(p._id.toString())
                    );

                    if (disponibles.length === 0) {
                        console.log(chalk.yellow('⚠️ Todos los proyectos ya tienen contratos.'));
                        break;
                    }

                    const { proyectoId } = await inquirer.prompt([
                        {
                            type: 'list',
                            name: 'proyectoId',
                            message: 'Selecciona el proyecto para asociar el contrato:',
                            choices: disponibles.map(p => ({
                                name: `${p.nombre} | Estado: ${p.estado}`,
                                value: p._id.toString()
                            }))
                        }
                    ]);

                    const { condiciones, fechaInicio, fechaFin, valorTotal } = await inquirer.prompt([
                        {
                            name: 'condiciones',
                            message: 'Condiciones del contrato:',
                            type: 'input',
                            validate: input => input.trim().length > 0 || 'Debe ingresar un texto'
                        },
                        {
                            name: 'fechaInicio',
                            message: 'Fecha de inicio (YYYY-MM-DD):',
                            validate: val => !isNaN(Date.parse(val)) || 'Formato de fecha inválido'
                        },
                        {
                            name: 'fechaFin',
                            message: 'Fecha de fin (YYYY-MM-DD):',
                            validate: val => !isNaN(Date.parse(val)) || 'Formato de fecha inválido'
                        },
                        {
                            name: 'valorTotal',
                            message: 'Valor total del contrato (USD):',
                            filter: Number,
                            validate: val => val > 0 || 'Debe ser un número positivo'
                        }
                    ]);

                    const contratoData = {
                        proyectoId,
                        condiciones,
                        fechaInicio: new Date(`${fechaInicio}T12:00:00`),
                        fechaFin: new Date(`${fechaFin}T12:00:00`),
                        valorTotal
                    };

                    const idContrato = await contratoService.crearContrato(contratoData);

                    console.log(chalk.green(`✅ Contrato creado con ID: ${idContrato}`));
                } catch (err) {
                    console.log(chalk.red(`❌ Error al crear contrato: ${err.message}`));
                }
                break;

            case 'listar':
                try {
                    const contratos = await contratoService.listarContratos();
                    if (contratos.length === 0) {
                        console.log(chalk.yellow('⚠️ No hay contratos registrados.'));
                        break;
                    }

                    const proyectoRepo = new ProyectoRepository(db);
                    const proyectos = await proyectoRepo.listar();

                    const tabla = contratos.map(c => {
                        const proyecto = proyectos.find(p => p._id.toString() === c.proyectoId);
                        return {
                            ID: c._id.toString(),
                            Proyecto: proyecto ? proyecto.nombre : `ID: ${c.proyectoId}`,
                            Valor: `$${c.valorTotal.toFixed(2)}`,
                            Inicio: new Date(c.fechaInicio).toISOString().slice(0, 10),
                            Fin: new Date(c.fechaFin).toISOString().slice(0, 10)

                        };
                    });

                    console.log(chalk.yellow.bold('\n📋 Lista de Contratos:\n'));
                    console.table(tabla);
                } catch (err) {
                    console.log(chalk.red(`❌ Error al listar contratos: ${err.message}`));
                }
                break;

            case 'verDetalle':
                try {
                    const contratos = await contratoService.listarContratos();
                    if (contratos.length === 0) {
                        console.log(chalk.yellow('⚠️ No hay contratos disponibles.'));
                        break;
                    }

                    const { contratoId } = await inquirer.prompt([
                        {
                            type: 'list',
                            name: 'contratoId',
                            message: 'Selecciona un contrato:',
                            choices: contratos.map(c => ({
                                name: `Contrato - Proyecto: ${c.proyectoId} | Valor: $${c.valorTotal}`,
                                value: c._id.toString()
                            }))
                        }
                    ]);

                    const contrato = await contratoService.buscarPorId(contratoId);

                    if (!contrato) {
                        console.log(chalk.red('❌ Contrato no encontrado.'));
                        break;
                    }

                    console.log(chalk.green.bold('\n📝 Detalle del Contrato:\n'));
                    console.log(chalk.cyan('ID:'), contrato._id.toString());
                    console.log(chalk.cyan('Proyecto ID:'), contrato.proyectoId);
                    console.log(chalk.cyan('Condiciones:'), contrato.condiciones);
                    console.log(chalk.cyan('Fecha de inicio:'), new Date(contrato.fechaInicio).toISOString().slice(0, 10));
                    console.log(chalk.cyan('Fecha de fin:'), new Date(contrato.fechaFin).toISOString().slice(0, 10));
                    console.log(chalk.cyan('Valor total:'), `$${contrato.valorTotal.toFixed(2)}`);
                    console.log(chalk.cyan('Creado en:'), new Date(contrato.creadoEn).toLocaleDateString());

                } catch (err) {
                    console.log(chalk.red(`❌ Error al ver detalle del contrato: ${err.message}`));
                }
                break;

            case 'salir':
                salir = true;
                break;

            default:
                console.log(chalk.yellow('🛠️ Función no implementada todavía.'));
                break;
        }
    }
}

export default mostrarMenuContratos;