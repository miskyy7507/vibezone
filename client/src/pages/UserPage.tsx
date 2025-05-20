import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { User } from "../interfaces/user.interface";
import { NotFound } from "./NotFound";
import { Spinner } from "../components/Spinner";
import { handleFetchError } from "../utils/handleFetchError";
import { toast } from "react-toastify";
import { apiUrl } from "../config";
import { ProfilePicture } from "../components/ProfilePicture";
import { Post } from "../interfaces/post.interface";
import { PostCard } from "../components/PostCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";

export function UserPage() {
    const [user, setUser] = useState<User | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [posts, setPosts] = useState<Post[] | null>(null);

    const { userId } = useParams();

    useEffect(() => {
        if (!userId || !/^[a-f0-9]{24}$/.test(userId)) {
            setNotFound(true);
            return;
        }

        void (async () => {
            try {
                const response = await fetch(
                    `${apiUrl}/profile/${userId}`, {
                        method: "GET",
                        credentials: "include",
                    }
                );

                if (response.status === 200) {
                    const userData = await response.json() as User;
                    setUser(userData);
                } else if (response.status === 404) {
                    setNotFound(true);
                } else {
                    console.error(await response.text());
                    toast.error("Something went wrong when trying to fetch user info. Try to reload the page.");
                }
            } catch (error) {
                handleFetchError(error);
            }
        })()
    }, [userId]);

    const deletePost = (id: string) => {
        setPosts((prev) => {
            if (!prev) return null;
            return prev.filter((i) => i._id !== id);
        })
    }

    useEffect(() => {
        if (!user) return;

        void (async () => {
            try {
                const response = await fetch(
                    `${apiUrl}/profile/${user._id}/posts`,
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );
                if (response.status === 200) {
                    const data = (await response.json()) as Post[];
                    setPosts(data);
                } else {
                    console.error(await response.text());
                    toast.error("An unexpected error occured when trying to fetch posts.");
                }
            } catch (error) {
                handleFetchError(error);
            }
        })();
    }, [user]);

    return notFound ? (
        <NotFound />
    ) : user ? (
        <main className="flex flex-col items-center gap-4 m-6">
            <ProfilePicture user={user} size="large" />
            <div className="flex flex-col items-center gap-1">
                <span className="font-semibold text-4xl">
                    {user.displayName || `@${user.username}`}
                </span>
                {user.displayName && (
                    <span className="text-zinc-500 text-lg">
                        @{user.username}
                    </span>
                )}
                <span className="text-zinc-500" title="Join date">
                    <FontAwesomeIcon className="mr-1.5" icon={faCalendar} />
                    {new Date(user.createdAt).toLocaleString("en-GB", {
                        dateStyle: "long",
                    })}
                </span>
            </div>
            {user.aboutDesc && (
                <p className=" text-zinc-400 text-xl">{user.aboutDesc}</p>
            )}
            {posts ? (
                posts.length !== 0 ? (
                    posts.map((post) => (
                        <PostCard
                            postData={post}
                            key={post._id}
                            deletePostCb={deletePost}
                            link
                        />
                    ))
                ) : (
                    <p className="my-3 text-zinc-500">
                        This user has not posted anything yet...
                    </p>
                )
            ) : (
                <div className="flex-1 flex items-center">
                    <Spinner size="large" theme="dark"></Spinner>
                </div>
            )}
        </main>
    ) : (
        <Spinner size="large" theme="dark" />
    );
}
