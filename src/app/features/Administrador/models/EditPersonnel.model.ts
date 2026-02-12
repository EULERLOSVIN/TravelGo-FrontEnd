export interface EditPersonnelModel {
    idAccount: number;
    firstName: string;
    lastName: string;
    idTypeDocument: number;
    numberDocument: string;
    phoneNumber: string;
    idRole: number;
    newPassword?: string;
    confirmPassword?: string;
    idStateOfAccount: number;
}