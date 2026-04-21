export declare class KycWebhookDto {
    externalUserId: string;
    review: {
        reviewStatus: string;
        createdAt?: string;
    };
    applicant?: {
        id: string;
        email?: string;
    };
}
