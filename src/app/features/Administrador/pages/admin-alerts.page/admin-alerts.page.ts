import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertsService } from '../../services/alerts.service';
import { SecurityAlertsModel, ExpiringSoatModel, ExpiringLicenseModel } from '../../models/SecurityAlerts.model';

@Component({
    selector: 'app-admin-alerts',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './admin-alerts.page.html',
    styleUrl: './admin-alerts.page.scss'
})
export class AdminAlertsComponent implements OnInit {
    alertsData: SecurityAlertsModel = {
        expiringSoat: [],
        expiringLicenses: [],
        totalSoatAlerts: 0,
        totalLicenseAlerts: 0
    };
    filteredSoat: ExpiringSoatModel[] = [];
    filteredLicenses: ExpiringLicenseModel[] = [];
    searchTerm: string = '';
    loading: boolean = true;

    constructor(private alertsService: AlertsService) { }

    ngOnInit(): void {
        this.loadAlerts();
    }

    loadAlerts(): void {
        this.loading = true;
        this.alertsService.getExpiringDocuments().subscribe({
            next: (result) => {
                if (result.isSuccess) {
                    this.alertsData = result.value;
                    this.filterAlerts();
                }
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    onSearch(): void {
        this.filterAlerts();
    }

    filterAlerts(): void {
        if (!this.alertsData) return;

        const term = this.searchTerm.toLowerCase();

        this.filteredSoat = this.alertsData.expiringSoat.filter(s =>
            s.plateNumber.toLowerCase().includes(term) ||
            s.unitNumber.toLowerCase().includes(term)
        );

        this.filteredLicenses = this.alertsData.expiringLicenses.filter(l =>
            l.driverName.toLowerCase().includes(term) ||
            l.licenseCategory.toLowerCase().includes(term)
        );
    }

    notificar(item: any): void {
        console.log('Notificar a:', item);
    }

    actualizarDocumento(item: any): void {
        console.log('Actualizar documento de:', item);
    }
}
