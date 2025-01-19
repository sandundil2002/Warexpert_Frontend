export class EmployeeModel {
    id: string;
    name: string;
    email: string;
    mobile: string;
    role: string;
    address: string;
    image: string;

    constructor(id: string, name: string, email: string, mobile: string, role: string, address: string, image: string) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.mobile = mobile;
        this.role = role;
        this.address = address;
        this.image = image;
    }
}