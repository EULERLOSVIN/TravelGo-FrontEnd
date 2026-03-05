import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouteFilter } from '../../models/queue.model';
import { RoutesService, DepartureTime } from '../../services/routes.service';

@Component({
  selector: 'app-register-queue',
  imports: [CommonModule, FormsModule],
  templateUrl: './register-queue.html',
  styleUrl: './register-queue.scss',
})
export class RegisterQueue implements OnChanges {
  @Input() routes: RouteFilter[] = [];
  @Input() selectedRouteId: number = 0;

  @Output() onAddQueue = new EventEmitter<{ dni: string, routeId: number, departureTimeId: number | null }>();

  driverDni: string = '';
  routeId: number = 0;
  departureTimeId: number | null = null;
  departureTimes: DepartureTime[] = [];

  constructor(private routesService: RoutesService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedRouteId']) {
      this.routeId = this.selectedRouteId;
      this.loadDepartureTimes(this.routeId);
    }
  }

  onRouteSelectChange(): void {
    this.departureTimeId = null;
    this.departureTimes = [];
    if (this.routeId) {
      this.loadDepartureTimes(this.routeId);
    }
  }

  loadDepartureTimes(idRoute: number): void {
    this.routesService.getDepartureTimesByRoute(idRoute).subscribe(res => {
      this.departureTimes = res || [];
    });
  }

  submit(): void {
    this.onAddQueue.emit({
      dni: this.driverDni,
      routeId: this.routeId,
      departureTimeId: this.departureTimeId
    });
    this.driverDni = ''; // Reset after submit
    this.departureTimeId = null;
  }
}
