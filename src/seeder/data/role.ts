import { ADMIN_ROLE, SUPERADMIN_ROLE, USER_ROLE } from "#/common/constants/role.constants";
import { Role } from "#/modules/roles/entities/role.entity";

export const roleMasterData: Role[] = [
  {
    id: '1b6f9d92-1f36-4a45-a1b8-bb594f49807a',
    role: USER_ROLE,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    user: []
  },
  {
    id: '2e5b6d92-2f36-4b45-b2b8-cb594f49807b',
    role: ADMIN_ROLE,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    user: []
  },
  {
    id: '3e6c9d92-3f36-4c45-c3b8-db594f49807c',
    role: SUPERADMIN_ROLE,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    user: []
  },
];
