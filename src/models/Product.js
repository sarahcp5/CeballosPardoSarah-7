import fs from 'fs';

class Product {
    constructor(name) {
        this.name = name;
        this.listProducts = [];
        this.id = 0;

        this.main();
    }

    async save(object) {
        this.id++;
        object['id'] = this.id;
        object['timestamp'] = Date.now();

        this.listProducts.push(object);

        await this.writeFile(this.listProducts);

        return this.id;
    }

    async getById(numberId) {
        let list = await this.getAll();
        let object = list.filter((object) => {
            return object.id == numberId;
        });
        return object.length != 0 ? object[0] : null;
    }

    async getAll() {
        this.main();

        return this.listProducts;
    }

    async deleteById(numberId) {
        this.listProducts = this.listProducts.filter((object) => {
            return object.id != numberId;
        })

        await this.writeFile(this.listProducts);
    }

    async deleteAll() {
        for (let i = this.listProducts.length; i > 0; i--) {
            this.listProducts.pop();
        }

        await this.writeFile(this.listProducts);

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

    async updateById(numberId, object) {
        let list = await this.getAll();

        let position = list.findIndex((objectI) => {
            return objectI.id == numberId;
        });
        if(position != -1) {
            object.id = list[position].id;
            list[position] = object;
            
            await this.writeFile(list);

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
    
    async writeFile(listProducts) {
        await fs.promises.writeFile(
            this.name,
            JSON.stringify(listProducts, null, 2)
        );
    }


}

export default Product;