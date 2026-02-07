import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-register-new-person',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './register-new-person.component.html',
    styleUrls: ['./register-new-person.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class RegisterNewPersonComponent {

}
