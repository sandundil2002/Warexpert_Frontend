export class Warehouse {
    id: string;
    name: string;
    location: string;
    size: string;
    capacity: string;
    staffMembers: string;
    inventories: string;
    image: string;

    constructor(id: string, name: string, location: string, size: string, capacity: string, staffMembers: string, inventories: string, image: string) {
        this.id = id;
        this.name = name;
        this.location = location;
        this.size = size;
        this.capacity = capacity;
        this.staffMembers = staffMembers;
        this.inventories = inventories;
        this.image = image;
    }
}