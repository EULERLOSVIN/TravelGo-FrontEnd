export interface FiltersManageSales {
  routes: RouteModel[];
  stateTickets: StateTicketModel[];
}

export interface RouteModel {
  idRoute: number;
  name: string;
}

export interface StateTicketModel {
  idState: number;
  name: string | null;
}