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
exports.NotesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const notes_service_1 = require("./notes.service");
const create_note_dto_1 = require("./dto/create-note.dto");
const update_note_dto_1 = require("./dto/update-note.dto");
const search_notes_dto_1 = require("./dto/search-notes.dto");
const note_response_dto_1 = require("./dto/note-response.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let NotesController = class NotesController {
    constructor(notesService) {
        this.notesService = notesService;
    }
    async create(createNoteDto, req) {
        const note = await this.notesService.create(createNoteDto, req.user.userId);
        return (0, class_transformer_1.plainToClass)(note_response_dto_1.NoteResponseDto, note);
    }
    async findAll(searchDto, req) {
        const result = await this.notesService.findAll(req.user.userId, searchDto);
        return {
            ...result,
            notes: result.notes.map(note => (0, class_transformer_1.plainToClass)(note_response_dto_1.NoteResponseDto, note)),
        };
    }
    async getCategories(req) {
        const categories = await this.notesService.getCategories(req.user.userId);
        return { categories };
    }
    async getTags(req) {
        const tags = await this.notesService.getTags(req.user.userId);
        return { tags };
    }
    async findOne(id, req) {
        const note = await this.notesService.findOne(id, req.user.userId);
        return (0, class_transformer_1.plainToClass)(note_response_dto_1.NoteResponseDto, note);
    }
    async update(id, updateNoteDto, req) {
        const note = await this.notesService.update(id, updateNoteDto, req.user.userId);
        return (0, class_transformer_1.plainToClass)(note_response_dto_1.NoteResponseDto, note);
    }
    async remove(id, req) {
        await this.notesService.remove(id, req.user.userId);
        return { message: 'Note deleted successfully' };
    }
};
exports.NotesController = NotesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new note' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Note created successfully', type: note_response_dto_1.NoteResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_note_dto_1.CreateNoteDto, Object]),
    __metadata("design:returntype", Promise)
], NotesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all notes with filtering and pagination' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Notes retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                notes: { type: 'array', items: { $ref: '#/components/schemas/NoteResponseDto' } },
                total: { type: 'number' },
                page: { type: 'number' },
                limit: { type: 'number' },
                totalPages: { type: 'number' },
            },
        },
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_notes_dto_1.SearchNotesDto, Object]),
    __metadata("design:returntype", Promise)
], NotesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all categories for current user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Categories retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotesController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)('tags'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all tags for current user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tags retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotesController.prototype, "getTags", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get note by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Note UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Note found', type: note_response_dto_1.NoteResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Note not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update note' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Note UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Note updated successfully', type: note_response_dto_1.NoteResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Note not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_note_dto_1.UpdateNoteDto, Object]),
    __metadata("design:returntype", Promise)
], NotesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete note' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Note UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Note deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Note not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotesController.prototype, "remove", null);
exports.NotesController = NotesController = __decorate([
    (0, swagger_1.ApiTags)('Notes'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('notes'),
    __metadata("design:paramtypes", [notes_service_1.NotesService])
], NotesController);
//# sourceMappingURL=notes.controller.js.map