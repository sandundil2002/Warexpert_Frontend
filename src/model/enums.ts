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
    Electronics: 200, 
    Clothing: 500,
    Food: 50,
    Furniture: 250,
    Other: 100,
};