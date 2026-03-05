import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouteFilter } from '../../models/queue.model';

@Component({
  selector: 'app-register-queue',
  imports: [CommonModule, FormsModule],
  templateUrl: './register-queue.html',
  styleUrl: './register-queue.scss',
})
export class RegisterQueue implements OnChanges {
  @Input() routes: RouteFilter[] = [];
  @Input() selectedRouteId: number = 0;

  @Output() onAddQueue = new EventEmitter<{ dni: string, routeId: number }>();

  driverDni: string = '';
  routeId: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedRouteId']) {
      this.routeId = this.selectedRouteId;
    }
  }

  submit(): void {
    this.onAddQueue.emit({ dni: this.driverDni, routeId: this.routeId });
    this.driverDni = ''; // Reset after submit
  }
}
