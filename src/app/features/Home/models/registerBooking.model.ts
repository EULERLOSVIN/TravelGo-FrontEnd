export interface RegisterBookingModel {
  idRoute: number;
  idVehicle: number;
  fullName: string;
  phoneNumeber: string;
  dni: string;
  email: string;
  operationCode: string;
  cardNumber: string;
  expirationDate: string;
  cvv: string;
  fullPayment: number;
  travelDate: string;
  seats: number[];
}