import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QueueItem } from '../../models/queue.model';

@Component({
  selector: 'app-delete-queue',
  imports: [CommonModule],
  templateUrl: './delete-queue.html',
  styleUrl: './delete-queue.scss',
})
export class DeleteQueue {
  @Input() item: QueueItem | null = null;
  @Output() onSubmit = new EventEmitter<void>();

  submit(): void {
    this.onSubmit.emit();
  }
}
