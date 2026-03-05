export interface SaleModel {
  idTicket: number;
  date: string | null;
  firstName: string;
  lastName: string;
  dni: string;
  route: string;
  seatNumber: number;
  unitPrice: number | null;
  paymentMethod: string;
}