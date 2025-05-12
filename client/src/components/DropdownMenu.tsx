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
    const styles: React.CSSProperties = rect
        ? {
              position: "absolute",
              top: rect.bottom + window.scrollY,
              left: rect.left + window.scrollX,
              background: "#fff",
              border: "1px solid #ccc",
              padding: "8px",
              zIndex: 9999,
          }
        : { display: "none" };

    return (
        <div ref={menuRef} style={styles}>
            {children}
        </div>
    );
};

export default DropdownMenu;
