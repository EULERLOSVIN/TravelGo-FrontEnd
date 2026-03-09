export interface ExpiringSoatModel {
    idVehicle: number;
    unitNumber: string;
    plateNumber: string;
    expirationDate: string;
    daysToExpiration: number;
}

export interface ExpiringLicenseModel {
    idPerson: number;
    driverName: string;
    licenseCategory: string;
    expirationDate: string;
    daysToExpiration: number;
}

export interface SecurityAlertsModel {
    expiringSoat: ExpiringSoatModel[];
    expiringLicenses: ExpiringLicenseModel[];
    totalSoatAlerts: number;
    totalLicenseAlerts: number;
}
