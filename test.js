import mongoose from 'mongoose';
import { MONGO_URI } from './config.js';  // Asegúrate de que 'MONGO_URI' esté correctamente importado desde tu archivo de configuración

async function testMongoConnection() {
  try {
    // Intentamos conectar con la base de datos
    await mongoose.connect(MONGO_URI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });
    
    console.log('Conexión exitosa a MongoDB Atlas');
    
    // Si la conexión es exitosa, podemos hacer una consulta de prueba
    const result = await mongoose.connection.db.collection('test').find({}).toArray();
    console.log('Resultado de la consulta de prueba:', result);

    // Cerrar la conexión después de la prueba
    await mongoose.disconnect();
    console.log('Conexión cerrada correctamente');
  } catch (error) {
    console.error('Error de conexión:', error);
  }
}

testMongoConnection();
