import inquirer from 'inquirer';
import chalk from 'chalk';
import ClienteRepository from '../repositories/ClienteRepository.js';
import ClienteService from '../services/ClienteService.js';
import { connectDB } from '../config/db.js';

const db = await connectDB();
const clienteService = new ClienteService(new ClienteRepository(db));

async function mostrarMenuClientes() {
    let salir = false;

    while (!salir) {
        const { accion } = await inquirer.prompt([
            {
                type: 'list',
                name: 'accion',
                message: chalk.cyanBright('¿Qué deseas hacer con los clientes?'),
                choices: [
                    '📄 Listar clientes',
                    '🆕 Crear nuevo cliente',
                    '✏️ Editar cliente',
                    '🗑️ Eliminar cliente',
                    new inquirer.Separator(),
                    '⬅️ Volver al menú principal'
                ]
            }
        ]);

        switch (accion) {
            case '📄 Listar clientes':
                const clientes = await clienteService.listarClientes();
                console.log(chalk.yellow.bold('\n📋 Lista de Clientes:\n'));
                console.table(clientes.map(c => ({
                    ID: c._id.toString(),
                    Nombre: c.nombre,
                    Email: c.email,
                    Teléfono: c.telefono
                })));
                break;

            case '🆕 Crear nuevo cliente':
                const nuevo = await inquirer.prompt([
                    { name: 'nombre', message: 'Nombre:' },
                    { name: 'email', message: 'Email:' },
                    { name: 'telefono', message: 'Teléfono:' }
                ]);
                try {
                    const id = await clienteService.crearCliente(nuevo);
                    console.log(chalk.green(`✅ Cliente creado con ID: ${id}`));
                } catch (err) {
                    console.log(chalk.red(`❌ Error: ${err.message}`));
                }
                break;

            case '✏️ Editar cliente':
                const clientesEditar = await clienteService.listarClientes();

                if (clientesEditar.length === 0) {
                    console.log(chalk.red('⚠️ No hay clientes para editar.'));
                    break;
                }

                const { clienteSeleccionado } = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'clienteSeleccionado',
                        message: 'Selecciona un cliente a editar:',
                        choices: clientesEditar.map(c => ({
                            name: `${c.nombre} (${c.email})`,
                            value: c._id.toString()
                        }))
                    }
                ]);

                const clienteActual = await clienteService.buscarPorId(clienteSeleccionado);

                const nuevosDatos = await inquirer.prompt([
                    {
                        name: 'nombre',
                        message: `Nombre [${clienteActual.nombre}]:`,
                        default: clienteActual.nombre
                    },
                    {
                        name: 'email',
                        message: `Email [${clienteActual.email}]:`,
                        default: clienteActual.email
                    },
                    {
                        name: 'telefono',
                        message: `Teléfono [${clienteActual.telefono}]:`,
                        default: clienteActual.telefono
                    }
                ]);

                try {
                    const actualizado = await clienteService.actualizarCliente(clienteSeleccionado, nuevosDatos);
                    console.log(actualizado
                        ? chalk.green('✅ Cliente actualizado correctamente.')
                        : chalk.red('❌ No se pudo actualizar el cliente.'));
                } catch (err) {
                    console.log(chalk.red(`❌ Error: ${err.message}`));
                }
                break;

            case '🗑️ Eliminar cliente':
                const clientesEliminar = await clienteService.listarClientes();

                if (clientesEliminar.length === 0) {
                    console.log(chalk.red('⚠️ No hay clientes para eliminar.'));
                    break;
                }

                const { clienteAEliminar } = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'clienteAEliminar',
                        message: 'Selecciona un cliente a eliminar:',
                        choices: clientesEliminar.map(c => ({
                            name: `${c.nombre} (${c.email})`,
                            value: c._id.toString()
                        }))
                    }
                ]);

                const { confirmarEliminacion } = await inquirer.prompt([
                    {
                        type: 'confirm',
                        name: 'confirmarEliminacion',
                        message: '¿Estás seguro de que quieres eliminar este cliente?',
                        default: false
                    }
                ]);

                if (confirmarEliminacion) {
                    const eliminado = await clienteService.eliminarCliente(clienteAEliminar);
                    console.log(eliminado
                        ? chalk.green('🗑️ Cliente eliminado exitosamente.')
                        : chalk.red('❌ No se pudo eliminar el cliente.'));
                } else {
                    console.log(chalk.yellow('❎ Operación cancelada.'));
                }
                break;

            case '⬅️ Volver al menú principal':
                salir = true;
                break;
        }
    }
}

export default mostrarMenuClientes;