class Propiedad {
  constructor({ 
    id, 
    titulo, 
    descripcion, 
    tipo, 
    direccion, 
    precio, 
    estado = 'Disponible',
    id_propietario 
  }) {
    this.id = id;
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.tipo = tipo;
    this.direccion = direccion;
    this.precio = precio;
    this.estado = estado;
    this.id_propietario = id_propietario;
  }

  static get ESTADOS() {
    return {
      DISPONIBLE: 'Disponible',
      RESERVADA: 'Reservada',
      ALQUILADA: 'Alquilada',
      INACTIVA: 'Inactiva'
    };
  }

  // Método para cambiar el estado de la propiedad
  cambiarEstado(nuevoEstado) {
    const estados = Object.values(Propiedad.ESTADOS);
    
    if (!estados.includes(nuevoEstado)) {
      throw new Error(`Estado inválido. Los estados válidos son: ${estados.join(', ')}`);
    }
    
    this.estado = nuevoEstado;
    return this;
  }

  // Verificar si la propiedad está disponible para alquiler
  estaDisponible() {
    return this.estado === Propiedad.ESTADOS.DISPONIBLE;
  }
}

module.exports = Propiedad;