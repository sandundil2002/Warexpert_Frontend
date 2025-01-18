export class Customer {
    id: string;
    name: string;
    address: string;
    mobile: string;
    email: string;

    constructor(id: string, name: string, address: string, mobile: string, email: string) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.mobile = mobile;
        this.email = email;
    }
}