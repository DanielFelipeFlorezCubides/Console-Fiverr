class Cliente {
    constructor({ nombre, email, telefono }) {
      if (!nombre || typeof nombre !== 'string') throw new Error("Nombre inválido");
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) throw new Error("Email inválido");
      if (!telefono || typeof telefono !== 'string') throw new Error("Teléfono inválido");
  
      this.nombre = nombre;
      this.email = email;
      this.telefono = telefono;
      this.creadoEn = new Date();
    }
  }
  
  export default Cliente;  