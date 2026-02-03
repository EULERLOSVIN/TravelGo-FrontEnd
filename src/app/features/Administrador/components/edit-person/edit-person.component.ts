import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-edit-person',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './edit-person.component.html',
    styleUrls: ['./edit-person.component.scss']
})
export class EditPersonComponent implements OnChanges {

    @Input() isOpen = false;
    @Input() personToEdit: any = null;
    @Output() close = new EventEmitter<void>();

    formData = {
        dni: '',
        fullName: '',
        phone: '',
        role: '',
        username: '',
        password: '',
        status: 'active'
    };

    showPassword = false;

    ngOnChanges(changes: SimpleChanges) {
        if (changes['personToEdit'] && this.personToEdit) {
            this.formData = {
                ...this.personToEdit,
                fullName: this.personToEdit.name
            };
        }
    }

    closeModal() {
        this.close.emit();
    }

    togglePassword() {
        this.showPassword = !this.showPassword;
    }

    update() {
        console.log('Update person:', this.formData);
        this.closeModal();
    }
}
