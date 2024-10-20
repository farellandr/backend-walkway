import { Role } from "#/modules/role/entities/role.entity";
import { Cart } from "#/modules/user/entities/cart.entity";
import { User } from "#/modules/user/entities/user.entity";
import { Status } from "#/utils/enums/status.enum";

export const userMasterData: User[] = [
  {
    id: '23131e76-ee28-407c-aed7-a5d573cb1cd3',
    name: 'gandarskuy',
    email: 'gandara@example.com',
    phone_number: '+628138231092',
    salt: '$2b$10$Y4vacOAG8OKhNKiQ8rtdJ.',
    password: '$2b$10$Y4vacOAG8OKhNKiQ8rtdJ.MB8YkEirJ7zv7q6y5VPZrHaGtXhfEqe', // superadmin
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    roleId: '3e6c9d92-3f36-4c45-c3b8-db594f49807c',
    role: { id: '3e6c9d92-3f36-4c45-c3b8-db594f49807c' } as Role,
    addresses: [],
    payments: [],
    bidParticipants: [],
    status: Status.ACTIVE,
    cart: {} as Cart,
    orders: []
  }
]