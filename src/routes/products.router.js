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

router.get('/', async(req, res) => {
    let listProducts = await products.getAll();
    return res.json(listProducts);
});

router.get('/:pid', async(req, res) => {
    let producto = await products.getById(req.params.pid);
    if(producto != null) {
        return res.json(producto);
    }
    return res.json(message);
});

router.post('/', middlewareAdmin, async(req, res) => {
    let isExist = products.isExist(req.body.code);
    if(!isExist) {
        let idProducto = await products.save(req.body);
        let producto = await products.getById(idProducto)
        return res.json(producto);
    }
    return res.json(messageRepeated);
});

router.put('/:pid', middlewareAdmin, async(req, res) => {
    let producto = await products.getById(req.params.pid);
    if(producto != null) {
        let producto = await products.updateById(req.params.pid, req.body);
        return res.json({ mensaje: `Se actualizo el producto con el Id ${req.params.pid}` });
    }
    return res.json(message);
});

router.delete('/:pid', middlewareAdmin, async(req, res) => {
    let product = await products.getById(req.params.pid)
    if(product != null) {
        await products.deleteById(req.params.pid);
        return res.json({ mensaje: `Se elimino el producto con el Id ${req.params.pid}` });
    }
    return res.json(message);
});

export default router;