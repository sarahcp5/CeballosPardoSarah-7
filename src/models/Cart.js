import fs from 'fs';

class Cart {
    constructor(name) {
        this.name = name;
        this.listCarts = [];
        this.id = 0;

        this.main()
    }

    save(object) {
        this.id++;
        object['id'] = this.id;
        object['timestamp'] = Date.now();
        object['products'] = [];
        
        this.listCarts.push(object);

        return this.id;
    }

    getById(numberId) {
        let object = this.listCarts.filter((object) => {
            return object.id == numberId;
        });
        return object.length != 0 ? object[0] : null;
    }

    getAll() {
        return this.listCarts;
    }

    deleteById(numberId) {
        this.listCarts = this.listCarts.filter((object) => {
            return object.id != numberId;
        })
    }

    deleteAll() {
        for (let i = this.listCarts.length; i > 0; i--) {
            this.listCarts.pop();
        }
    }

    getProductsById(numberId, productsList) {
        let products = this.listCarts.filter((object) => {
            return object.id == numberId;
        })[0].products;
        if(products.length != 0){
            let p =  products.map((pCart) => {
                let productIndex = productsList.filter((object) => {
                    return object.id == pCart.id;
                });
                if(productIndex.length != 0){
                    productIndex[0].quantity = pCart.quantity;
                    return productIndex[0];
                }
            })
            return p
        }
        return products    
    }

    saveProductById(numberIdCart, numberIdProduct) {
        let cartIndex = this.listCarts.findIndex((object) => {
            return object.id == numberIdCart;
        });

        let productIndex = this.listCarts[cartIndex].products.findIndex((object) => {
            return object.id == numberIdProduct;
        });

        if(productIndex != -1) {
            this.listCarts[cartIndex].products[productIndex].quantity = this.listCarts[cartIndex].products[productIndex].quantity + 1;
        }
        else {
            this.listCarts[cartIndex].products.push({ "id": numberIdProduct, "quantity": 1 });
        }
    }

    deleteProductById(numberIdCart, numberIdProduct){
        this.listCarts.filter((cart) => {
            return cart.id == numberIdCart;
        })[0].products = this.listCarts.filter((cart) => {
            return cart.id == numberIdCart;
        })[0].products.filter((product) => {
            return product.id != numberIdProduct;
        })
    }

    async main() {
        try {
            const carts = await fs.promises.readFile(this.name);
            this.listCarts = JSON.parse(carts);
            for(let cart of this.listCarts
                ) {
                if (cart.id > this.id) {
                    this.id = cart.id;
                }
            }
        } catch (error) {
            console.log(`Actualmente no existe un archivo de carritos con el nombre: ${this.name}`);
        }
    }
}

export default Cart;