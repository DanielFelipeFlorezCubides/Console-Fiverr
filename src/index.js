import chalk from 'chalk';
import inquirer from 'inquirer';
import { connectDB, client } from './config/db.js';

console.clear();
console.log(chalk.green.bold('🚀 Bienvenido a Console-Fiverr'));

const db = await connectDB();

console.log(chalk.yellow('Sistema inicializado correctamente ✔️'));

await client.close();
