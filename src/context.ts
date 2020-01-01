import Koa from 'koa';

export interface Context extends Koa.DefaultContext {
    success: (data: any, status?: number) => void;
    error: (status: number, message: string, data?: {[k: string]: any}) => void;
}
