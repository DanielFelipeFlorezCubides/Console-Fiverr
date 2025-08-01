import chalk from 'chalk';
import inquirer from 'inquirer';
import { connectDB, client } from './config/db.js';
import mostrarMenuClientes from './commands/clienteCommand.js';

console.clear();
console.log(chalk.green.bold('🚀 Bienvenido a Console-Fiverr\n'));
const db = await connectDB();

let salir = false;

while (!salir) {
    const { modulo } = await inquirer.prompt([
        {
            type: 'list',
            name: 'modulo',
            message: chalk.cyanBright('¿Qué módulo deseas gestionar?'),
            choices: [
                { name: '👥 Clientes', value: 'clientes' },
                { name: '📑 Propuestas', value: 'propuestas' },
                { name: '🏗️ Proyectos', value: 'proyectos' },
                { name: '📦 Entregables', value: 'entregables' },
                { name: '💰 Finanzas', value: 'finanzas' },
                new inquirer.Separator(),
                { name: '❌ Salir', value: 'salir' }
            ]
        }
    ]);

    switch (modulo) {
        case 'clientes':
            await mostrarMenuClientes();
            break;
        case 'salir':
            salir = true;
            break;
        default:
            console.log(chalk.yellow('🔧 Módulo aún no implementado\n'));
    }
}

await client.close();
console.log(chalk.green('👋 Aplicación finalizada correctamente.'));