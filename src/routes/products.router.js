import Router from 'express';
import Product from '../models/Product.js';
import __dirname from "../utils.js";

const router = Router();
const file = __dirname + "/files/products.txt";
const products = new Product(file);

const mensajeErrorAdmin = { error: -1, descripcion: '' };
const message = { error : -3, descripcion: 'Producto no encontrado.' };
const messageRepeated = { error : -4, descripcion: 'Producto repetido.' };

const middlewareAdmin = (req, res, next) => {
    if(!req.admin) {
        mensajeErrorAdmin.descripcion = `ruta ${req.url} método ${req.method} no autorizada`;
        return res.json(mensajeErrorAdmin);
    }
    next();
}

router.get('/', (req, res) => {
    let listProducts = products.getAll();
    return res.json(listProducts);
});

router.get('/:pid', (req, res) => {
    let producto = products.getById(req.params.pid);
    if(producto != null) {
        return res.json(producto);
    }
    return res.json(message);
});

router.post('/', middlewareAdmin, (req, res) => {
    let isExist = products.isExist(req.body.code);
    console.log(isExist)
    if(!isExist) {
        let idProducto = products.save(req.body);
        let producto = products.getById(idProducto)
        return res.json(producto);
    }
    return res.json(messageRepeated);
});

router.put('/:pid', middlewareAdmin, (req, res) => {
    let producto = products.getById(req.params.pid);
    if(producto != null) {
        let producto = products.updateById(req.params.pid, req.body);
        return res.json(producto);
    }
    return res.json(message);
});

router.delete('/:pid', middlewareAdmin, (req, res) => {
    let product = products.getById(req.params.pid)
    if(product != null) {
        products.deleteById(req.params.pid);
        return res.json({ mensaje: `Se elimino el producto con el Id ${req.params.pid}` });
    }
    return res.json(message);
});

export default router;