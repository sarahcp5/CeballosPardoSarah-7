import express from 'express';
import __dirname from './utils.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';

const app = express();
const PORT = 8080;
const admin = true;
const mensajeErrorURL = { error: -2, descripcion: '' };

const server = app.listen(PORT, () => {
    console.log(`Servidor HTTP escuchando en el puerto ${server.address().port}`);
});
server.on("Error", error => console.log(`Error en servidor ${error}`));

app.use(express.json());
app.use(express.urlencoded({ extended : true }))
app.use(express.static(__dirname + '/public'))


app.use((req, res, next) => {
    req.admin = admin;
    next();
});

app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)

app.use((req, res) => {   
    mensajeErrorURL.descripcion = `ruta ${req.url} método ${req.method} no implementada`;
    return  res.json(mensajeErrorURL);
});