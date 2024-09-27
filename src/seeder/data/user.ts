import { Role } from "#/modules/roles/entities/role.entity";
import { User } from "#/modules/users/entities/user.entity";

export const userMasterData: User[] = [
    {
        id: '23131e76-ee28-407c-aed7-a5d573cb1cd3',
        name: 'gandarskuy',
        email: 'gandara@example.com',
        phoneNumber: '08123456',
        salt: '$2b$10$Y4vacOAG8OKhNKiQ8rtdJ.',
        password: '$2b$10$Y4vacOAG8OKhNKiQ8rtdJ.MB8YkEirJ7zv7q6y5VPZrHaGtXhfEqe', // superadmin
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        role: { id: '3e6c9d92-3f36-4c45-c3b8-db594f49807c' } as Role,
        addresses: [],
        payments: []
    }
]