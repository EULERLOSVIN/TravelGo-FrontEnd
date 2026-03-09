export interface QueueItem {
    idAssignQueue: number;
    turn: number;
    driverFullName: string;
    driverDni: string;
    vehiclePlate: string;
    vehicleModel: string;
    idRoute: number;
    destinationName: string;
    occupiedSeats: number;
    totalSeats: number;
    scheduledDepartureTime: string;
    remainingMinutes: number;
    status: string;
}

export interface RouteFilter {
    idRoute: number;
    destinationName: string;
    inQueueCount: number;
}

export interface HeadquarterContext {
    idHeadquarter: number;
    headquarterName: string;
    hasRoutes: boolean;
}
