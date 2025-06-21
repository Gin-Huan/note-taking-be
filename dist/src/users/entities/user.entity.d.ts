import { Note } from '../../notes/entities/note.entity';
export declare class User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    notes: Note[];
    get fullName(): string;
}
