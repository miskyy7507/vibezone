export interface Post {
    id: string;
    authorDisplayName?: string;
    authorUsername: string;
    authorPfpUri?: string;
    content: string;
    imageUri?: string;
    likes: number;
    isLikedByUser: boolean;
    timestamp: string;
}
