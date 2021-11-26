import { HttpStatus } from '@nestjs/common';

export interface ResponseData {
    statusCode: HttpStatus,
    message: string | string[],
    data?: any[] | undefined,
    meta?: {
        page: number | undefined;
        limit: number | undefined;
        totalDocs: number | undefined;
        totalPages: number | undefined;
    }
}