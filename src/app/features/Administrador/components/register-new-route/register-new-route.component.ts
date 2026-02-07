import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-new-route',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register-new-route.component.html',
  styleUrls: ['./register-new-route.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RegisterNewRouteComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
}
