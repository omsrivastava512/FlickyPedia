import { useRef, useState } from "react";
const END_OF_LIST_HEIGHT = 50;

export function Box({ children, isList = false }: { children: React.ReactNode; isList?: boolean }) {
  const [isOpen, setIsOpen] = useState(true);

  const listContainerRef = useRef<HTMLDivElement>(null);

  const snapBackTimer = useRef<number | undefined>(undefined);

  const handleScroll = () => {
    if (!isList) return;
    const el = listContainerRef.current;
    if (!el) return;

    // How far has the user scrolled into the "End of list" zone?
    const normalBottom = el.scrollHeight - el.clientHeight - END_OF_LIST_HEIGHT;
    const overscrollAmount = el.scrollTop - normalBottom;

    if (overscrollAmount > 0) {
      // User is revealing the "End of list" div — start the snap-back timer
      clearTimeout(snapBackTimer.current);
      snapBackTimer.current = setTimeout(() => {
        el.scrollTo({
          top: normalBottom,
          behavior: 'smooth'
        });
      }, 800); // let them read "End of list" for 200ms before snapping back
    }
  };

  return (

    <div className="box" ref={listContainerRef} onScroll={handleScroll}>
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>

      {isOpen && children}
    </div>
  );
}
