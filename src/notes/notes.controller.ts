import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { SearchNotesDto } from './dto/search-notes.dto';
import { NoteResponseDto } from './dto/note-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Notes')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new note' })
  @ApiResponse({ status: 201, description: 'Note created successfully', type: NoteResponseDto })
  async create(
    @Body() createNoteDto: CreateNoteDto,
    @Request() req,
  ): Promise<NoteResponseDto> {
    const note = await this.notesService.create(createNoteDto, req.user.userId);
    return plainToClass(NoteResponseDto, note);
  }

  @Get()
  @ApiOperation({ summary: 'Get all notes with filtering and pagination' })
  @ApiResponse({ 
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
  })
  async findAll(
    @Query() searchDto: SearchNotesDto,
    @Request() req,
  ): Promise<{
    notes: NoteResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const result = await this.notesService.findAll(req.user.userId, searchDto);
    return {
      ...result,
      notes: result.notes.map(note => plainToClass(NoteResponseDto, note)),
    };
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all categories for current user' })
  @ApiResponse({ status: 200, description: 'Categories retrieved successfully' })
  async getCategories(@Request() req): Promise<{ categories: string[] }> {
    const categories = await this.notesService.getCategories(req.user.userId);
    return { categories };
  }

  @Get('tags')
  @ApiOperation({ summary: 'Get all tags for current user' })
  @ApiResponse({ status: 200, description: 'Tags retrieved successfully' })
  async getTags(@Request() req): Promise<{ tags: string[] }> {
    const tags = await this.notesService.getTags(req.user.userId);
    return { tags };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get note by ID' })
  @ApiParam({ name: 'id', description: 'Note UUID' })
  @ApiResponse({ status: 200, description: 'Note found', type: NoteResponseDto })
  @ApiResponse({ status: 404, description: 'Note not found' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
  ): Promise<NoteResponseDto> {
    const note = await this.notesService.findOne(id, req.user.userId);
    return plainToClass(NoteResponseDto, note);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update note' })
  @ApiParam({ name: 'id', description: 'Note UUID' })
  @ApiResponse({ status: 200, description: 'Note updated successfully', type: NoteResponseDto })
  @ApiResponse({ status: 404, description: 'Note not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @Request() req,
  ): Promise<NoteResponseDto> {
    const note = await this.notesService.update(id, updateNoteDto, req.user.userId);
    return plainToClass(NoteResponseDto, note);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete note' })
  @ApiParam({ name: 'id', description: 'Note UUID' })
  @ApiResponse({ status: 200, description: 'Note deleted successfully' })
  @ApiResponse({ status: 404, description: 'Note not found' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
  ): Promise<{ message: string }> {
    await this.notesService.remove(id, req.user.userId);
    return { message: 'Note deleted successfully' };
  }
}