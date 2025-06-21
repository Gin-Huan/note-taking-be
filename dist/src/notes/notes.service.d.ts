import { Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { SearchNotesDto } from './dto/search-notes.dto';
export declare class NotesService {
    private readonly noteRepository;
    constructor(noteRepository: Repository<Note>);
    create(createNoteDto: CreateNoteDto, userId: string): Promise<Note>;
    findAll(userId: string, searchDto: SearchNotesDto): Promise<{
        notes: Note[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string, userId: string): Promise<Note>;
    update(id: string, updateNoteDto: UpdateNoteDto, userId: string): Promise<Note>;
    remove(id: string, userId: string): Promise<void>;
    getCategories(userId: string): Promise<string[]>;
    getTags(userId: string): Promise<string[]>;
    private applyFilters;
}
