import { PostCard } from "../components/PostCard";
import type { Post } from "../interfaces/post.interface";

export function Home() {
    const placeholderPosts: Array<Post> = [
        {
            id: "1",
            authorDisplayName: "Arthur",
            authorUsername: "arthuro",
            content: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. At unde ea iste!",
            isLikedByUser: false,
            likes: 0,
            timestamp: new Date(Date.now()).toISOString()
        },
        {
            id: "2",
            authorDisplayName: "/[Mm]iskyy?/g",
            authorUsername: "miskyy_",
            content: "Cool photo I took on the last day of vacation! 😎",
            imageUri: "https://travel.usnews.com/images/Maldives_beach1_Getty_levente_bodo.jpg",
            isLikedByUser: true,
            likes: 4,
            timestamp: new Date(Date.now()).toISOString()
        }
    ]

    return (
        <div className="flex flex-col items-center">
            {
                placeholderPosts.map((post) => (
                    <PostCard postData={post} key={post.id} />
                ))
            }
        </div>
    );
}
