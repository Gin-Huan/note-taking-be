import { PartialType } from '@nestjs/swagger';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsDateString } from 'class-validator';
import { CreateNoteDto } from './create-note.dto';

export class UpdateNoteDto extends PartialType(CreateNoteDto) {
  @ApiPropertyOptional({
    description: 'Note updated timestamp',
    example: '2023-12-01T10:30:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  updatedAt?: string;
}