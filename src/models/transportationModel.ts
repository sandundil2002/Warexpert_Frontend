export class TransportationModel {
    id: string;
    name: string;
    category: string;
    quantity: string;
    warehouse: string;
    image: string;

    constructor(id: string, name: string, category: string, quantity: string, warehouse: string, image: string) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.quantity = quantity;
        this.warehouse = warehouse;
        this.image = image;
    }
}