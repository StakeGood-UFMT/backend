import { NgosService } from './ngos.service';
export declare class NgosController {
    private readonly ngosService;
    constructor(ngosService: NgosService);
    findAll(category?: string, verified?: string, limit?: number, offset?: number, sort?: string): Promise<{
        ngos: import("../../database/entities/ngo.entity").NgoEntity[];
        pagination: {
            total: number;
            limit: number;
            offset: number;
            has_next: boolean;
        };
    }>;
}
