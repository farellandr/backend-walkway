import { Role } from "#/modules/role/entities/role.entity";
import { ADMIN_ROLE, SUPERADMIN_ROLE, USER_ROLE } from "#/utils/constants/role.name";
import { Status } from "#/utils/enums/status.enum";

export const roleMasterData: Role[] = [
  {
    id: '3e6c9d92-3f36-4c45-c3b8-db594f49807c',
    name: SUPERADMIN_ROLE,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    users: [],
    status: Status.ACTIVE
  },
  {
    id: '2e5b6d92-2f36-4b45-b2b8-cb594f49807b',
    name: USER_ROLE,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    users: [],
    status: Status.ACTIVE
  },
];