import { ResponseData } from "./interfaces/response"


class BaseService {

    _success(statusCode: number, message: string | string[], data?: any, page?: number, limit?: number, totalDocs?: number, totalPages?: number): ResponseData {
        return {
            statusCode: statusCode,
            message: message,
            data: data || {},
            meta: {
                page: page,
                limit: limit,
                totalDocs: totalDocs,
                totalPages: totalPages
            }
        }
    }

    _error(statusCode: number, message: string | string[]): ResponseData {
        return {
            statusCode: statusCode,
            message: message
        }
    }

}
export default BaseService