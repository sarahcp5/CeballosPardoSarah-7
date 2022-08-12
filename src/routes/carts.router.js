import Router from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import __dirname from "../utils.js";

const router = Router();
const fileCarts = __dirname + "/files/carts.txt"
const carts = new Cart(fileCarts);
const fileProducts = __dirname + "/files/products.txt";
const products = new Product(fileProducts);
const menssageErrorCart = { error: -5, descripcion: 'Carrito no encontrado.' };
const messageProduct = { error : -3, descripcion: 'Producto no encontrado.' };

router.get('/', (req, res) => {
    let listCarts = carts.getAll();
    return res.json(listCarts);
});

router.post('/', async(req, res) => {
    let idCart = await carts.save(req.body);
    return res.json({ "id" : idCart});
});

router.delete('/:cid', (req, res) => {
    let cart = carts.getById(req.params.cid);
    if(cart != null) {
        carts.deleteById(req.params.cid);
        return res.json({mensaje: `Se elimino el Carrito con el Id ${req.params.cid}`});
    }
    return res.json(menssageErrorCart);
});

router.get('/:cid/products', async(req, res) => {
    let cart = carts.getById(req.params.cid);
    if(cart != null) {
        let listProducts = await products.getAll();

        let productsCarts = carts.getProductsById(req.params.cid, listProducts);       
        if(productsCarts.length != 0) {
            return res.json(productsCarts);
        }
        else {
            return res.json({mensaje: `No hay Productos en el Carrito con el Id ${req.params.cid}`});
        }
    }
    return res.json(menssageErrorCart);
});

router.post('/:cid/products', async(req, res) => {
    let cart = carts.getById(req.params.cid);
    if(cart != null) {
        let listProducts = await products.getAll();
        let product = await products.getById(req.body.pid);
        if(product != null) {
            await carts.saveProductById(req.params.cid, product.id);
            return res.json({mensaje: `Se cargo correctamente el Producto con el Id ${req.body.pid} en el Carrito con el Id ${req.params.cid}`});
        }
        else {
            return res.json(messageProduct);
        }
    }
    return res.json(menssageErrorCart);
});

router.delete('/:cid/products/:pid', async(req, res) => {
    let cart = carts.getById(req.params.cid);
            
    if(cart != null) {    
        let producto = await products.getById(req.params.pid)
        if(producto != null) {   
            carts.deleteProductById(req.params.cid, req.params.pid);
            return res.json({mensaje: `Se elimino el Producto con el Id ${req.params.pid} en el Carrito con el Id ${req.params.cid}`});     
    
        }
        return res.json(messageProduct);
    }
    return res.json(menssageErrorCart);
});

export default router;