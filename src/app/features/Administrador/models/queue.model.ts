export interface QueueItem {
    idQueue: number;
    turnNumber: number;
    driverDni: string;
    driverFullName: string;
    arrivalTime: Date;
    scheduledDepartureTime: Date;
    estimatedWaitTimeMinutes: number;
    idVehicle?: number;
    vehiclePlate?: string;
    vehicleModel?: string;
    occupiedSeats: number;
    totalSeats: number;
    idRoute: number;
    routeName: string;
    statusName: string; // 'En Cola', 'Próximo a Salir'
}

export interface RouteFilter {
    idRoute: number;
    destinationName: string;
    inQueueCount: number;
}

export interface HeadquarterContext {
    idHeadquarter: number;
    headquarterName: string;
}
