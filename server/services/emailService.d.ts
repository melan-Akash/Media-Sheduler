export declare const sendWelcomeEmail: (to: string, userName: string) => Promise<void>;
export declare const sendPostScheduledEmail: (to: string, userName: string, postDetails: {
    content: string;
    platforms: string[];
    scheduledFor: string;
    mediaUrl?: string;
}) => Promise<void>;
export declare const sendAccountConnectedEmail: (to: string, userName: string, accountDetails: {
    name: string;
    platform: string;
}) => Promise<void>;
export declare const sendPostPublishedEmail: (to: string, userName: string, postDetails: {
    content: string;
    platforms: string[];
    mediaUrl?: string;
}) => Promise<void>;
//# sourceMappingURL=emailService.d.ts.map