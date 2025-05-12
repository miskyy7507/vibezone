import { useEffect, useRef } from "react";
interface DropdownMenuProps {
    anchorRef: React.RefObject<HTMLElement | null>;
    onClose: () => void;
    children: React.ReactNode;
}

const DropdownMenu = ({ anchorRef, onClose, children }: DropdownMenuProps) => {
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target as Node) &&
                anchorRef.current &&
                !anchorRef.current.contains(e.target as Node)
            ) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose, anchorRef]);

    const rect = anchorRef.current?.getBoundingClientRect();
    const styles: React.CSSProperties | undefined = rect && {
        position: "absolute",
        top: rect.bottom + window.scrollY,
        left: rect.right + window.scrollX,
        transform: "translateX(-100%)",
    };

    return (
        <div
            ref={menuRef}
            className={"flex flex-col gap-4 bg-zinc-800 border border-zinc-700 p-4 rounded-xl z-999"}
            style={styles}
            onClick={(e) => {
                e.stopPropagation();
            }}
        >
            {children}
        </div>
    );
};

export default DropdownMenu;
