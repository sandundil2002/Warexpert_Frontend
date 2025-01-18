export class Inventory {
    id: string;
    name: string;
    category: string;
    quantity: string;
    price: string;
    warehouse: string;
    image: string;

    constructor(id: string, name: string, category: string, quantity: string, price: string, warehouse: string, image: string) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.quantity = quantity;
        this.price = price;
        this.warehouse = warehouse;
        this.image = image;
    }
}