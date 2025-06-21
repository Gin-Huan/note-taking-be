import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { SearchNotesDto } from './dto/search-notes.dto';
import { NoteResponseDto } from './dto/note-response.dto';
export declare class NotesController {
    private readonly notesService;
    constructor(notesService: NotesService);
    create(createNoteDto: CreateNoteDto, req: any): Promise<NoteResponseDto>;
    findAll(searchDto: SearchNotesDto, req: any): Promise<{
        notes: NoteResponseDto[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getCategories(req: any): Promise<{
        categories: string[];
    }>;
    getTags(req: any): Promise<{
        tags: string[];
    }>;
    findOne(id: string, req: any): Promise<NoteResponseDto>;
    update(id: string, updateNoteDto: UpdateNoteDto, req: any): Promise<NoteResponseDto>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
