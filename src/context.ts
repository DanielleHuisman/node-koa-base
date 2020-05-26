export interface Context {
    success: (data: any, status?: number) => void;
    error: (status: number, message: string, data?: {[k: string]: any}) => void;
}
