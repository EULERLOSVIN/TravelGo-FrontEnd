export interface Headquarter {
    idHeadquarter: number;
    name: string;
    address: string;
    department: string;
    province: string;
    district: string;
    phone: string;
    email?: string;
    isMain: boolean; 
    registrationDate?: Date; // O string, dependiendo de cómo lo maneje Angular por defecto
    stateHeadquarter: string; // El nombre del estado que viene del backend
}
