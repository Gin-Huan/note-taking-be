"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const notes_service_1 = require("./notes.service");
const note_entity_1 = require("./entities/note.entity");
describe('NotesService', () => {
    let service;
    let repository;
    const mockNote = {
        id: '1',
        title: 'Test Note',
        content: 'Test content',
        category: 'work',
        isPinned: false,
        isArchived: false,
        tags: ['test'],
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 'user1',
        user: null,
    };
    const mockRepository = {
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
        remove: jest.fn(),
        find: jest.fn(),
        createQueryBuilder: jest.fn(),
    };
    const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn(),
        select: jest.fn().mockReturnThis(),
        getRawMany: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                notes_service_1.NotesService,
                {
                    provide: (0, typeorm_1.getRepositoryToken)(note_entity_1.Note),
                    useValue: mockRepository,
                },
            ],
        }).compile();
        service = module.get(notes_service_1.NotesService);
        repository = module.get((0, typeorm_1.getRepositoryToken)(note_entity_1.Note));
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('create', () => {
        const createNoteDto = {
            title: 'Test Note',
            content: 'Test content',
            category: 'work',
            tags: ['test'],
        };
        it('should create a note successfully', async () => {
            mockRepository.create.mockReturnValue(mockNote);
            mockRepository.save.mockResolvedValue(mockNote);
            const result = await service.create(createNoteDto, 'user1');
            expect(mockRepository.create).toHaveBeenCalledWith({
                ...createNoteDto,
                userId: 'user1',
            });
            expect(result).toEqual(mockNote);
        });
    });
    describe('findAll', () => {
        const searchDto = {
            page: 1,
            limit: 10,
            sortBy: 'createdAt',
            sortOrder: 'DESC',
        };
        it('should return paginated notes', async () => {
            const notes = [mockNote];
            const total = 1;
            mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
            mockQueryBuilder.getManyAndCount.mockResolvedValue([notes, total]);
            const result = await service.findAll('user1', searchDto);
            expect(result).toEqual({
                notes,
                total,
                page: 1,
                limit: 10,
                totalPages: 1,
            });
        });
    });
    describe('findOne', () => {
        it('should return a note if found', async () => {
            mockRepository.findOne.mockResolvedValue(mockNote);
            const result = await service.findOne('1', 'user1');
            expect(result).toEqual(mockNote);
        });
        it('should throw NotFoundException if note not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);
            await expect(service.findOne('1', 'user1')).rejects.toThrow(common_1.NotFoundException);
        });
    });
    describe('remove', () => {
        it('should remove a note successfully', async () => {
            mockRepository.findOne.mockResolvedValue(mockNote);
            mockRepository.remove.mockResolvedValue(mockNote);
            await service.remove('1', 'user1');
            expect(mockRepository.remove).toHaveBeenCalledWith(mockNote);
        });
    });
});
//# sourceMappingURL=notes.service.spec.js.map