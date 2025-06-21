"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const users_service_1 = require("./users.service");
const user_entity_1 = require("./entities/user.entity");
jest.mock('bcrypt');
describe('UsersService', () => {
    let service;
    let repository;
    const mockUser = {
        id: '1',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'hashedPassword',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        notes: [],
        get fullName() {
            return `${this.firstName} ${this.lastName}`;
        },
    };
    const mockRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        remove: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                users_service_1.UsersService,
                {
                    provide: (0, typeorm_1.getRepositoryToken)(user_entity_1.User),
                    useValue: mockRepository,
                },
            ],
        }).compile();
        service = module.get(users_service_1.UsersService);
        repository = module.get((0, typeorm_1.getRepositoryToken)(user_entity_1.User));
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('create', () => {
        const createUserDto = {
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
            password: 'password123',
        };
        it('should create a user successfully', async () => {
            mockRepository.findOne.mockResolvedValue(null);
            mockRepository.create.mockReturnValue(mockUser);
            mockRepository.save.mockResolvedValue(mockUser);
            bcrypt.hash.mockResolvedValue('hashedPassword');
            const result = await service.create(createUserDto);
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 12);
            expect(mockRepository.create).toHaveBeenCalledWith({
                ...createUserDto,
                password: 'hashedPassword',
            });
            expect(result).toEqual(mockUser);
        });
        it('should throw ConflictException if user already exists', async () => {
            mockRepository.findOne.mockResolvedValue(mockUser);
            await expect(service.create(createUserDto)).rejects.toThrow(common_1.ConflictException);
        });
    });
    describe('findOne', () => {
        it('should return a user if found', async () => {
            mockRepository.findOne.mockResolvedValue(mockUser);
            const result = await service.findOne('1');
            expect(result).toEqual(mockUser);
        });
        it('should throw NotFoundException if user not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);
            await expect(service.findOne('1')).rejects.toThrow(common_1.NotFoundException);
        });
    });
    describe('validatePassword', () => {
        it('should return true for valid password', async () => {
            bcrypt.compare.mockResolvedValue(true);
            const result = await service.validatePassword('password', 'hashedPassword');
            expect(result).toBe(true);
            expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedPassword');
        });
        it('should return false for invalid password', async () => {
            bcrypt.compare.mockResolvedValue(false);
            const result = await service.validatePassword('wrongpassword', 'hashedPassword');
            expect(result).toBe(false);
        });
    });
});
//# sourceMappingURL=users.service.spec.js.map