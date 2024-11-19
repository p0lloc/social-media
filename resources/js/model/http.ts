export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
}