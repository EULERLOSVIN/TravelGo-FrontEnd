import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QueueItem, RouteFilter } from '../../models/queue.model';

@Component({
  selector: 'app-edit-queue',
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-queue.html',
  styleUrl: './edit-queue.scss',
})
export class EditQueue implements OnChanges {
  @Input() itemToEdit: QueueItem | null = null;
  @Input() routes: RouteFilter[] = [];

  @Output() onSubmit = new EventEmitter<number>();

  routeId: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['itemToEdit'] && this.itemToEdit) {
      this.routeId = this.itemToEdit.idRoute;
    }
  }

  submit(): void {
    if (this.routeId) {
      this.onSubmit.emit(this.routeId);
    }
  }
}
