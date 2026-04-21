import { Repository } from 'typeorm';
import { NgoEntity } from '../../database/entities/ngo.entity';
interface FindAllOptions {
    category?: string;
    verified?: boolean;
    limit: number;
    offset: number;
    sort: string;
}
export declare class NgosService {
    private readonly ngoRepo;
    constructor(ngoRepo: Repository<NgoEntity>);
    findAll(options: FindAllOptions): Promise<{
        ngos: NgoEntity[];
        pagination: {
            total: number;
            limit: number;
            offset: number;
            has_next: boolean;
        };
    }>;
}
export {};
