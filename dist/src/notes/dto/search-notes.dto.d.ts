export declare class SearchNotesDto {
    q?: string;
    category?: string;
    tags?: string[];
    isPinned?: boolean;
    isArchived?: boolean;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    page?: number;
    limit?: number;
}
