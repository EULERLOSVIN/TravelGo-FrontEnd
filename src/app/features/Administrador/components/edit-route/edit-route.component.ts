import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-edit-route',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './edit-route.component.html',
    styleUrls: ['./edit-route.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EditRouteComponent {
    @Input() isOpen = false;
    @Input() routeToEdit: any = null;
    @Output() close = new EventEmitter<void>();
}

