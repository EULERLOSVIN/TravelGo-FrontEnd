export interface RouteInformationModel {
    idRoute: number;
    nameRoute: string;
    price: number;
    departureHour: DepartureTimeByQueueModel[];
}

export interface DepartureTimeByQueueModel {
    id: number;
    departureHour: string,
    vehicle: VehicleModel | null;
}

export interface VehicleModel {
    id: number;
    photo: string | null;
    availableSeats: number;
}