import { RoleModel } from "./role.model";
import { StateAccountModel } from "./stateAccount.model";
import { TypeDocumentModel } from "./type-document.model";

export interface RolesAndDocumentTypes {
  roles: RoleModel[];
  documentTypes: TypeDocumentModel[];
  stateOfAccount: StateAccountModel[];
}
