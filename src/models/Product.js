import fs from 'fs';

class Product {
    constructor(name) {
        this.name = name;
        this.listProducts = [];
        this.id = 0;

        this.main()
    }

    save(object) {
        this.id++;
        object['id'] = this.id;
        object['timestamp'] = Date.now();

        this.listProducts.push(object);

        return this.id;
    }

    getById(numberId) {
        let object = this.listProducts.filter((object) => {
            return object.id == numberId;
        });
        return object.length != 0 ? object[0] : null;
    }

    getAll() {
        return this.listProducts;
    }

    deleteById(numberId) {
            this.listProducts = this.listProducts.filter((object) => {
            return object.id != numberId;
        })
    }

    deleteAll() {
        for (let i = this.listProducts.length; i > 0; i--) {
            this.listProducts.pop();
        }
    }

    async main() {
        try {
            const products = await fs.promises.readFile(this.name);
            this.listProducts = JSON.parse(products);
            for(let product of this.listProducts) {
                if (product.id > this.id) {
                    this.id = product.id;
                }
            }
        } catch (error) {
            console.log(`Actualmente no existe un archivo de productos con el nombre: ${this.name}`);
        }
    }

    updateById(numberId, object) {
        let position = this.listProducts.findIndex((objectI) => {
            return objectI.id == numberId;
        });
        if(position != -1) {
            object.id = this.listProducts[position].id;
            this.listProducts[position] = object;
            
            return object;
        }
        return null        
    }

    isExist(code) {
        let product = this.listProducts.filter((object) => {
            return object.code == code;
        });
        
        return product.length != 0 ? true : false;
    }
}

export default Product;