export enum UserRole {
    MANAGER = "MANAGER",
    SUPERVISOR = "SUPERVISOR",
    OPERATOR = "OPERATOR",
    OTHER = "OTHER"
}

export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
    OTHER = "OTHER"
}

export const CATEGORY_PRICES: { [key: string]: number } = {
    Electronics: 500, // Price per unit for Electronics
    Clothing: 100,    // Price per unit for Clothing
    Food: 50,         // Price per unit for Food
    Furniture: 300,   // Price per unit for Furniture
    Other: 150,       // Price per unit for Other
};