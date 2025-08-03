const connection = require('../config/db');

class Product {
    constructor(id, name, description, price, originalPrice, remaining,  isHot, isNew, images, detailImages, styles) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.originalPrice = originalPrice;
        this.remaining = remaining; // 默认剩余数量为0
        this.isHot = isHot;
        this.isNew = isNew;
        this.images = images;
        this.detailImages = detailImages;
        this.styles = styles;
    }

    static async getAllProducts() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM products';
            connection.query(query, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }
}

module.exports = Product;