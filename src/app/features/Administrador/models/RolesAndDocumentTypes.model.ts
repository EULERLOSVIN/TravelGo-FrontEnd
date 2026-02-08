import { RoleModel } from "./role.model";
import { TypeDocumentModel } from "./type-document.model";

export interface RolesAndDocumentTypes {
  roles: RoleModel[];
  documentTypes: TypeDocumentModel[];
}
