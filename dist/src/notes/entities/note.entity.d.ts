import { User } from '../../users/entities/user.entity';
export declare class Note {
    id: string;
    title: string;
    content: string;
    category: string;
    isPinned: boolean;
    isArchived: boolean;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    user: User;
}
