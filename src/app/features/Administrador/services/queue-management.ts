import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HeadquarterContext, QueueItem, RouteFilter } from '../models/queue.model';

@Injectable({
  providedIn: 'root',
})
export class QueueManagement {

  // Mock Data
  private mockHeadquarters: HeadquarterContext[] = [
    { idHeadquarter: 1, headquarterName: 'Terminal Tingo María' },
    { idHeadquarter: 2, headquarterName: 'Terminal Huánuco' }
  ];

  private mockRoutes: RouteFilter[] = [
    { idRoute: 101, destinationName: 'Hacia Tocache', inQueueCount: 5 },
    { idRoute: 102, destinationName: 'Hacia Huánuco', inQueueCount: 2 },
    { idRoute: 103, destinationName: 'Hacia Pucallpa', inQueueCount: 0 }
  ];

  private mockQueue: QueueItem[] = [
    {
      idQueue: 1, turnNumber: 1, driverDni: '45890211', driverFullName: 'Ricardo Mendoza Flores',
      arrivalTime: new Date(new Date().setHours(new Date().getHours() - 1, 20)), scheduledDepartureTime: new Date(new Date().getTime() + 15 * 60000), estimatedWaitTimeMinutes: 15,
      idVehicle: 55, vehiclePlate: 'ABC-123', vehicleModel: 'Toyota Hiace', occupiedSeats: 12, totalSeats: 15, idRoute: 101, routeName: 'Tocache', statusName: 'Próximo a Salir'
    },
    {
      idQueue: 2, turnNumber: 2, driverDni: '72109934', driverFullName: 'Julian Alarcón Ruiz',
      arrivalTime: new Date(new Date().setMinutes(new Date().getMinutes() - 35)), scheduledDepartureTime: new Date(new Date().getTime() + 45 * 60000), estimatedWaitTimeMinutes: 45,
      idRoute: 101, vehiclePlate: 'DEF-456', vehicleModel: 'Nissan Urvan', occupiedSeats: 4, totalSeats: 15, routeName: 'Tocache', statusName: 'En Cola'
    },
    {
      idQueue: 3, turnNumber: 3, driverDni: '22817456', driverFullName: 'Maria Vasquez Soto',
      arrivalTime: new Date(new Date().setMinutes(new Date().getMinutes() - 20)), scheduledDepartureTime: new Date(new Date().getTime() + 80 * 60000), estimatedWaitTimeMinutes: 80,
      idVehicle: 12, vehiclePlate: 'XYZ-987', vehicleModel: 'Hyundai H-1', occupiedSeats: 0, totalSeats: 20, idRoute: 101, routeName: 'Tocache', statusName: 'En Cola'
    }
  ];

  constructor() { }

  getHeadquarters(): Observable<HeadquarterContext[]> {
    return of(this.mockHeadquarters);
  }

  getRoutesByHeadquarter(idHeadquarter: number): Observable<RouteFilter[]> {
    return of(this.mockRoutes);
  }

  getQueue(idHeadquarter: number, idRoute: number): Observable<QueueItem[]> {
    const filtered = this.mockQueue.filter(q => q.idRoute === idRoute);
    return of(filtered);
  }

  addDriverToQueue(dni: string, idRoute: number): Observable<boolean> {
    const newItem: QueueItem = {
      idQueue: Math.floor(Math.random() * 1000),
      turnNumber: this.mockQueue.filter(q => q.idRoute === idRoute).length + 1,
      driverDni: dni,
      driverFullName: 'Chofer Test (' + dni + ')',
      arrivalTime: new Date(),
      scheduledDepartureTime: new Date(new Date().getTime() + 120 * 60000),
      estimatedWaitTimeMinutes: 120,
      vehiclePlate: 'NUE-000',
      vehicleModel: 'Auto Test',
      occupiedSeats: 0,
      totalSeats: 15,
      idRoute: idRoute,
      routeName: 'Ruta ' + idRoute,
      statusName: 'En Cola'
    };
    this.mockQueue.push(newItem);

    const route = this.mockRoutes.find(r => r.idRoute === idRoute);
    if (route) route.inQueueCount++;

    return of(true).pipe(delay(300));
  }

  removeDriverFromQueue(idQueue: number): Observable<boolean> {
    this.mockQueue = this.mockQueue.filter(q => q.idQueue !== idQueue);
    return of(true).pipe(delay(200));
  }
}
