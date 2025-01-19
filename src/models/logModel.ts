export class LogsModel {
    id: string;
    warehouse: string;
    inventory: string;
    action: string;
    timestamp: string;
    user: string;

    constructor(id: string, warehouse: string, inventory: string, action: string, timestamp: string, user: string){
        this.id = id;
        this.warehouse = warehouse;
        this.inventory = inventory;
        this.action = action;
        this.timestamp = timestamp;
        this.user = user;
    }
}