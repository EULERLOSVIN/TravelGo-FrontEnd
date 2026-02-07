import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-delete-route',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './delete-route.component.html',
    styleUrls: ['./delete-route.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DeleteRouteComponent {
    @Input() isOpen = false;
    @Output() close = new EventEmitter<void>();
}

