import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Note } from './entities/note.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { SearchNotesDto } from './dto/search-notes.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
  ) {}

  async create(createNoteDto: CreateNoteDto, userId: string): Promise<Note> {
    const note = this.noteRepository.create({
      ...createNoteDto,
      userId,
    });

    return this.noteRepository.save(note);
  }

  async findAll(userId: string, searchDto: SearchNotesDto): Promise<{
    notes: Note[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { page, limit, q, category, tags, isPinned, isArchived, sortBy, sortOrder } = searchDto;

    const queryBuilder = this.noteRepository
      .createQueryBuilder('note')
      .where('note.userId = :userId', { userId });

    this.applyFilters(queryBuilder, { q, category, tags, isPinned, isArchived });

    // Always sort by isPinned first (pinned notes at top)
    queryBuilder.orderBy('note.isPinned', 'DESC');

    // Apply additional sorting if specified
    if (sortBy) {
      queryBuilder.addOrderBy(`note.${sortBy}`, sortOrder);
    }

    // Add secondary sort by createdAt for consistency
    if (sortBy !== 'createdAt') {
      queryBuilder.addOrderBy('note.createdAt', 'DESC');
    }

    // Apply pagination
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

  async findOne(id: string, userId: string): Promise<Note> {
    const note = await this.noteRepository.findOne({
      where: { id },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return note;
  }

  async update(id: string, updateNoteDto: UpdateNoteDto, userId: string): Promise<Note> {
    const note = await this.findOne(id, userId);
    
    // Extract updatedAt from DTO and handle it separately
    const { updatedAt, ...updateData } = updateNoteDto;
    
    // Apply all other fields
    Object.assign(note, updateData);
    
    // If updatedAt is provided, set it manually, otherwise let TypeORM handle it
    if (updatedAt) {
      note.updatedAt = new Date(updatedAt);
    }
    
    return this.noteRepository.save(note);
  }

  async remove(id: string, userId: string): Promise<void> {
    const note = await this.findOne(id, userId);
    await this.noteRepository.remove(note);
  }

  async getCategories(userId: string): Promise<string[]> {
    const result = await this.noteRepository
      .createQueryBuilder('note')
      .select('DISTINCT note.category', 'category')
      .where('note.userId = :userId', { userId })
      .andWhere('note.category IS NOT NULL')
      .andWhere('note.category != ""')
      .getRawMany();

    return result.map(item => item.category);
  }

  async getTags(userId: string): Promise<string[]> {
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

  private applyFilters(
    queryBuilder: SelectQueryBuilder<Note>,
    filters: {
      q?: string;
      category?: string;
      tags?: string[];
      isPinned?: boolean;
      isArchived?: boolean;
    },
  ): void {
    const { q, category, tags, isPinned, isArchived } = filters;

    if (q) {
      queryBuilder.andWhere(
        '(note.title LIKE :search OR note.content LIKE :search)',
        { search: `%${q}%` },
      );
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
}