export interface Context {
    success: (data: unknown, status?: number) => void;
    error: (status: number, message: string, data?: Record<string, unknown>) => void;
}
