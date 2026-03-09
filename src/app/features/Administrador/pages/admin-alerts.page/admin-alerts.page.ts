import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { delay } from 'rxjs';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
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
    currentDate: string = '';
    alertsData: any = {
        totalSoatAlerts: 0,
        totalLicenseAlerts: 0,
        expiringSoat: [],
        expiringLicenses: [],
        alertsByHeadquarter: []
    };

    kpiCards: any[] = [];
    filteredSoat: ExpiringSoatModel[] = [];
    filteredLicenses: ExpiringLicenseModel[] = [];
    searchTerm: string = '';
    loading: boolean = true;

    constructor(
        private alertsService: AlertsService,
        private cd: ChangeDetectorRef
    ) {
        this.updateCurrentDate();
    }

    ngOnInit(): void {
        this.loadAlerts();
    }

    updateCurrentDate(): void {
        const today = new Date();
        const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
        this.currentDate = today.toLocaleDateString('es-ES', options).toUpperCase();
    }

    loadAlerts(): void {
        this.loading = true;
        this.alertsService.getExpiringDocuments()
            .pipe(delay(1500)) // Cinematic delay for "analysis" feel
            .subscribe({
                next: (result) => {
                    if (result.isSuccess) {
                        this.alertsData = {
                            ...this.alertsData,
                            ...result.value
                        };
                        this.prepareKpiCards();
                        this.filterAlerts();
                    }
                    this.loading = false;
                    this.cd.detectChanges();
                },
                error: () => {
                    this.loading = false;
                    this.cd.detectChanges();
                }
            });
    }

    prepareKpiCards(): void {
        if (!this.alertsData) return;

        const total = this.alertsData.totalSoatAlerts + this.alertsData.totalLicenseAlerts;

        this.kpiCards = [
            {
                label: 'Vehículos (SOAT)',
                value: this.alertsData.totalSoatAlerts,
                icon: 'bi-bus-front',
                color: 'danger',
                sub: 'Vencimientos Críticos',
                trend: 12 // Simulated trend for visual parity
            },
            {
                label: 'Personal (Licencias)',
                value: this.alertsData.totalLicenseAlerts,
                icon: 'bi-person-vcard',
                color: 'warning',
                sub: 'Documentos Próximos',
                trend: -5
            },
            {
                label: 'Tasa de Cumplimiento',
                value: '92.4%',
                icon: 'bi-shield-check',
                color: 'success',
                sub: 'Meta Operativa: 100%',
                isProgress: true
            },
            {
                label: 'Incidencias Totales',
                value: total,
                icon: 'bi-broadcast-pin',
                color: 'slate',
                sub: 'Reporte Acumulado',
                trend: 8
            }
        ];
    }

    onSearch(): void {
        this.filterAlerts();
    }

    filterAlerts(): void {
        if (!this.alertsData) return;

        const term = this.searchTerm.toLowerCase();

        this.filteredSoat = this.alertsData.expiringSoat.filter((s: any) =>
            s.plateNumber.toLowerCase().includes(term) ||
            s.unitNumber.toLowerCase().includes(term)
        );

        this.filteredLicenses = this.alertsData.expiringLicenses.filter((l: any) =>
            l.driverName.toLowerCase().includes(term) ||
            l.licenseCategory.toLowerCase().includes(term)
        );
    }

    getTrendClass(trend: number): string {
        return trend > 0 ? 'text-danger' : 'text-success';
    }

    getTrendIcon(trend: number): string {
        return trend > 0 ? 'bi-graph-up-arrow' : 'bi-graph-down-arrow';
    }

    downloadReport(): void {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // --- Branding & Header ---
        doc.setFillColor(15, 23, 42); // Slate 900
        doc.rect(0, 0, pageWidth, 40, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('TRAVEL GO', 20, 25);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('AUDITORIA DE SEGURIDAD OPERATIVA', 20, 32);

        doc.setFontSize(10);
        const reportDate = new Date().toLocaleString();
        doc.text(`REPORTE: TG-02 | ${reportDate}`, pageWidth - 20, 25, { align: 'right' });

        // --- Summary Section ---
        doc.setTextColor(51, 65, 85);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Resumen de Incidencias Documentales', 20, 55);

        const summaryData = [
            ['Categoría', 'Cantidad', 'Estado Critico'],
            ['Vehículos (SOAT)', this.alertsData.totalSoatAlerts.toString(), this.filteredSoat.filter(s => s.daysToExpiration <= 7).length.toString()],
            ['Conductores (Licencias)', this.alertsData.totalLicenseAlerts.toString(), this.filteredLicenses.filter(l => l.daysToExpiration <= 7).length.toString()],
            ['Total General', (this.alertsData.totalSoatAlerts + this.alertsData.totalLicenseAlerts).toString(), '-']
        ];

        autoTable(doc, {
            startY: 65,
            head: [summaryData[0]],
            body: summaryData.slice(1),
            theme: 'striped',
            headStyles: { fillColor: [79, 70, 229] }
        });

        // --- Detailed Table: SOAT ---
        if (this.filteredSoat.length > 0) {
            doc.setFontSize(12);
            doc.text('Detalle de Vehículos con SOAT Próximo a Vencer', 20, (doc as any).lastAutoTable.finalY + 15);

            autoTable(doc, {
                startY: (doc as any).lastAutoTable.finalY + 20,
                head: [['Unidad', 'Placa', 'Vencimiento', 'Días Restantes']],
                body: this.filteredSoat.map(s => [
                    s.unitNumber,
                    s.plateNumber,
                    s.expirationDate,
                    s.daysToExpiration <= 0 ? 'VENCE HOY' : s.daysToExpiration.toString()
                ]),
                headStyles: { fillColor: [239, 68, 68] }
            });
        }

        // --- Detailed Table: Licenses ---
        if (this.filteredLicenses.length > 0) {
            doc.setFontSize(12);
            const nextY = (doc as any).lastAutoTable.finalY + 15;
            if (nextY > 250) doc.addPage();
            doc.text('Detalle de Conductores con Licencias Próximas a Vencer', 20, nextY);

            autoTable(doc, {
                startY: (doc as any).lastAutoTable.finalY + 20,
                head: [['Conductor', 'Categoría', 'Vencimiento', 'Estado']],
                body: this.filteredLicenses.map(l => [
                    l.driverName,
                    l.licenseCategory,
                    l.expirationDate,
                    l.daysToExpiration <= 0 ? 'VENCIDO' : `${l.daysToExpiration} días`
                ]),
                headStyles: { fillColor: [245, 158, 11] }
            });
        }

        // --- Footer ---
        const pageCount = (doc as any).internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(148, 163, 184);
            doc.text(
                `TravelGo Operations Management System - Reporte Confidencial - Página ${i} de ${pageCount}`,
                pageWidth / 2,
                doc.internal.pageSize.getHeight() - 10,
                { align: 'center' }
            );
        }

        doc.save(`TG-02_Reporte_Seguridad_${new Date().toISOString().split('T')[0]}.pdf`);
    }

    notificar(item: any): void {
        console.log('Notificar a:', item);
    }

    actualizarDocumento(item: any): void {
        console.log('Actualizar documento de:', item);
    }
}
