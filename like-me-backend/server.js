const express = require('express');
const cors = require('cors');
const pool = require('./db');  // Importa la configuración de la DB

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());  // Habilita CORS (requerimiento 1)
app.use(express.json());  // Para parsear JSON en POST

// Ruta GET /posts: Devuelve todos los posts de la tabla (requerimiento 3)
app.get('/posts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM posts');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener posts' });
  }
});

// Ruta POST /posts: Agrega un nuevo post a la tabla (requerimiento 4)
app.post('/posts', async (req, res) => {
  const { titulo, url, descripcion } = req.body;  // El frontend envía { titulo, url, descripcion }
  try {
    const query = 'INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, $4)';
    const values = [titulo, url, descripcion, 0];  // Likes inicia en 0
    await pool.query(query, values);
    res.status(201).json({ message: 'Post agregado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar post' });
  }
});

// Ruta PUT /posts/like/:id: Incrementa los likes 
app.put('/posts/like/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Primero, verifica si el post existe y obtiene el valor actual de likes
    const selectQuery = 'SELECT likes FROM posts WHERE id = $1';
    const selectResult = await pool.query(selectQuery, [id]);
    if (selectResult.rowCount === 0) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }
    const currentLikes = selectResult.rows[0].likes;
    
    // Incrementa los likes en 1
    const updateQuery = 'UPDATE posts SET likes = $1 WHERE id = $2';
    const newLikes = currentLikes + 1;
    await pool.query(updateQuery, [newLikes, id]);
    
    res.json({ message: 'Likes actualizados', likes: newLikes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar likes' });
  }
});

// Ruta DELETE /posts/:id: Elimina un post específico (requerimiento adicional)
app.delete('/posts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'DELETE FROM posts WHERE id = $1';
    const result = await pool.query(query, [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }
    res.json({ message: 'Post eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar post' });
  }
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});