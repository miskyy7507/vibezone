import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartHollow } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { clsx } from "clsx";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { handleFetchError } from "../utils/handleFetchError";
import { toast } from "react-toastify";

interface LikeButtonProps {
    what: "post" | "comment"
    id: string;
    isLiked: boolean;
    likeCount: number;
}

export function LikeButton({
    what,
    id,
    isLiked: initialIsLiked,
    likeCount: initialLikeCount,
}: LikeButtonProps) {
    const { user, logout } = useAuth();

    const [disabled, setDisabled] = useState(!user);
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [likeCount, setLikeCount] = useState(initialLikeCount);

    useEffect(() => {
        if (user === null) {
            setIsLiked(false);
            setDisabled(true);
        }
    }, [user]);

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setDisabled(true);

        const toLike = !isLiked;

        try {
            const response = await fetch(
                `http://localhost:6660/api/${what}/${id}/like`,
                {
                    method: toLike ? "PUT" : "DELETE",
                    credentials: "include",
                }
            );
            if (response.status === 204) {
                setIsLiked(toLike);
                setLikeCount((count) => count + (toLike ? 1 : -1));
            } else if (response.status === 401) {
                toast.warn("Your session has expired. Please log in back.", {});
                logout();
            } else {
                console.error(await response.text());
                toast.error("Something went wrong when trying to do this action. Try to reload the page.");
            }
        } catch (error) {
            handleFetchError(error);
        } finally {
            setDisabled(false);
        }
    }

    return (
        <div className="flex flex-row flex-1 justify-start">
            <button
                className={clsx(
                    isLiked && "text-pink-500",
                    "flex items-center gap-x-2 text-sm text-zinc-500 enabled:hover:text-pink-500 enabled:cursor-pointer transition"
                )}
                onClick={(e) => void handleClick(e)}
                disabled={disabled}
            >
                {isLiked ? (
                    <FontAwesomeIcon icon={faHeart} />
                ) : (
                    <FontAwesomeIcon icon={faHeartHollow} />
                )}
                <span>{likeCount}</span>
            </button>
        </div>
    );
}
