import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class NoteResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  content: string;

  @ApiProperty()
  @Expose()
  category: string;

  @ApiProperty()
  @Expose()
  isPinned: boolean;

  @ApiProperty()
  @Expose()
  isArchived: boolean;

  @ApiProperty()
  @Expose()
  tags: string[];

  @ApiProperty()
  @Expose()
  color: string;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => {
    if (value) {
      const date = new Date(value);
      const vietnamTime = new Date(date.getTime() + (7 * 60 * 60 * 1000)); // UTC+7
      return vietnamTime;
    }
    return value;
  })
  createdAt: Date;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => {
    if (value) {
      const date = new Date(value);
      const vietnamTime = new Date(date.getTime() + (7 * 60 * 60 * 1000)); // UTC+7
      return vietnamTime;
    }
    return value;
  })
  updatedAt: Date;

  @ApiProperty()
  @Expose()
  userId: string;
}