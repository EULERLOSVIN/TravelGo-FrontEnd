export interface LoginResponse {
  // Agregado para que los módulos independientes (como Mi Perfil) reconozcan al usuario
  idAccount: number;
  
  token: string;
  email: string;
  rol: string;
  idAccount: number;
}