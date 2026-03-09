export interface TravelRouteModel {
    idTravelRoute?: number;
    nameRoute: string; // "Origen - Destino"
    price: number;
    idPlaceA: number;
    idPlaceB: number;
    isActive?: boolean;
}