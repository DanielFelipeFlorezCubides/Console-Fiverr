import fs from 'fs';
import path from 'path';
import { Parser } from 'json2csv';

export async function exportarMovimientos({ movimientos, formato, nombreArchivo }) {
  const exportDir = path.resolve('exports');
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir);
  }

  const ruta = path.join(exportDir, `${nombreArchivo}.${formato}`);

  if (formato === 'json') {
    fs.writeFileSync(ruta, JSON.stringify(movimientos, null, 2));
  } else if (formato === 'csv') {
    const parser = new Parser();
    const csv = parser.parse(movimientos);
    fs.writeFileSync(ruta, csv);
  } else {
    throw new Error('Formato no soportado.');
  }

  return ruta;
}