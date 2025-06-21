"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const note_entity_1 = require("./entities/note.entity");
let NotesService = class NotesService {
    constructor(noteRepository) {
        this.noteRepository = noteRepository;
    }
    async create(createNoteDto, userId) {
        const note = this.noteRepository.create({
            ...createNoteDto,
            userId,
        });
        return this.noteRepository.save(note);
    }
    async findAll(userId, searchDto) {
        const { page, limit, q, category, tags, isPinned, isArchived, sortBy, sortOrder } = searchDto;
        const queryBuilder = this.noteRepository
            .createQueryBuilder('note')
            .where('note.userId = :userId', { userId });
        this.applyFilters(queryBuilder, { q, category, tags, isPinned, isArchived });
        if (sortBy) {
            queryBuilder.orderBy(`note.${sortBy}`, sortOrder);
        }
        if (sortBy !== 'createdAt') {
            queryBuilder.addOrderBy('note.createdAt', 'DESC');
        }
        const offset = (page - 1) * limit;
        queryBuilder.skip(offset).take(limit);
        const [notes, total] = await queryBuilder.getManyAndCount();
        const totalPages = Math.ceil(total / limit);
        return {
            notes,
            total,
            page,
            limit,
            totalPages,
        };
    }
    async findOne(id, userId) {
        const note = await this.noteRepository.findOne({
            where: { id, userId },
        });
        if (!note) {
            throw new common_1.NotFoundException('Note not found');
        }
        return note;
    }
    async update(id, updateNoteDto, userId) {
        const note = await this.findOne(id, userId);
        Object.assign(note, updateNoteDto);
        return this.noteRepository.save(note);
    }
    async remove(id, userId) {
        const note = await this.findOne(id, userId);
        await this.noteRepository.remove(note);
    }
    async getCategories(userId) {
        const result = await this.noteRepository
            .createQueryBuilder('note')
            .select('DISTINCT note.category', 'category')
            .where('note.userId = :userId', { userId })
            .andWhere('note.category IS NOT NULL')
            .andWhere('note.category != ""')
            .getRawMany();
        return result.map(item => item.category);
    }
    async getTags(userId) {
        const notes = await this.noteRepository.find({
            where: { userId },
            select: ['tags'],
        });
        const allTags = notes.reduce((acc, note) => {
            if (note.tags && Array.isArray(note.tags)) {
                acc.push(...note.tags);
            }
            return acc;
        }, []);
        return [...new Set(allTags)];
    }
    applyFilters(queryBuilder, filters) {
        const { q, category, tags, isPinned, isArchived } = filters;
        if (q) {
            queryBuilder.andWhere('(note.title LIKE :search OR note.content LIKE :search)', { search: `%${q}%` });
        }
        if (category) {
            queryBuilder.andWhere('note.category = :category', { category });
        }
        if (tags && tags.length > 0) {
            queryBuilder.andWhere('JSON_OVERLAPS(note.tags, :tags)', {
                tags: JSON.stringify(tags),
            });
        }
        if (isPinned !== undefined) {
            queryBuilder.andWhere('note.isPinned = :isPinned', { isPinned });
        }
        if (isArchived !== undefined) {
            queryBuilder.andWhere('note.isArchived = :isArchived', { isArchived });
        }
    }
};
exports.NotesService = NotesService;
exports.NotesService = NotesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(note_entity_1.Note)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], NotesService);
//# sourceMappingURL=notes.service.js.map