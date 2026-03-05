import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-queue-add-driver',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './queue-add-driver.html',
  styleUrl: './queue-add-driver.scss',
})
export class QueueAddDriver {
  newDriverDni: string = '';

  @Output() onAddDriver = new EventEmitter<string>();

  submitDriver() {
    if (this.newDriverDni.trim()) {
      this.onAddDriver.emit(this.newDriverDni.trim());
      this.newDriverDni = '';
    }
  }
}
