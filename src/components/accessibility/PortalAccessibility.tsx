import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

const CONTRAST_STORAGE_KEY = "portal-high-contrast";
const CONTRAST_POSITION_STORAGE_KEY = "portal-contrast-position";

type TargetKey = "content" | "menu" | "footer";

const targetMap: Record<TargetKey, { id: string; fallbackSelector: string }> = {
  content: { id: "conteudo-principal", fallbackSelector: "main, [data-main-content]" },
  menu: { id: "menu-principal", fallbackSelector: "nav" },
  footer: { id: "rodape-site", fallbackSelector: "footer" },
};

const focusTarget = (target: TargetKey) => {
  const config = targetMap[target];
  const element =
    document.getElementById(config.id) ??
    (document.querySelector(config.fallbackSelector) as HTMLElement | null);

  if (!element) return;

  if (!element.hasAttribute("tabindex")) {
    element.setAttribute("tabindex", "-1");
  }

  element.focus();
  element.scrollIntoView({ behavior: "smooth", block: "start" });
};

const PortalAccessibility = () => {
  const [highContrast, setHighContrast] = useState(false);
  const [position, setPosition] = useState({ x: 12, y: 12 });
  const [isDragging, setIsDragging] = useState(false);
  const hasMovedRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const persisted = globalThis.localStorage.getItem(CONTRAST_STORAGE_KEY) === "1";
    setHighContrast(persisted);
    document.documentElement.classList.toggle("high-contrast", persisted);

    const persistedPosition = globalThis.localStorage.getItem(CONTRAST_POSITION_STORAGE_KEY);
    if (persistedPosition) {
      try {
        const parsed = JSON.parse(persistedPosition) as { x: number; y: number };
        setPosition(parsed);
      } catch {
        globalThis.localStorage.removeItem(CONTRAST_POSITION_STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!event.altKey || event.ctrlKey || event.metaKey) return;

      if (event.key === "1") {
        event.preventDefault();
        focusTarget("content");
      }
      if (event.key === "2") {
        event.preventDefault();
        focusTarget("menu");
      }
      if (event.key === "3") {
        event.preventDefault();
        focusTarget("footer");
      }
    };

    globalThis.addEventListener("keydown", onKeyDown);
    return () => globalThis.removeEventListener("keydown", onKeyDown);
  }, []);

  const toggleContrast = () => {
    if (hasMovedRef.current) {
      hasMovedRef.current = false;
      return;
    }

    setHighContrast((previous) => {
      const next = !previous;
      document.documentElement.classList.toggle("high-contrast", next);
      globalThis.localStorage.setItem(CONTRAST_STORAGE_KEY, next ? "1" : "0");
      return next;
    });
  };

  const clampPosition = (x: number, y: number) => {
    const minX = 8;
    const minY = 8;
    const maxX = globalThis.innerWidth - 180;
    const maxY = globalThis.innerHeight - 48;

    return {
      x: Math.max(minX, Math.min(x, maxX)),
      y: Math.max(minY, Math.min(y, maxY)),
    };
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const element = event.currentTarget.getBoundingClientRect();
    dragOffsetRef.current = {
      x: event.clientX - element.left,
      y: event.clientY - element.top,
    };

    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!isDragging) return;

    hasMovedRef.current = true;
    const nextX = event.clientX - dragOffsetRef.current.x;
    const nextY = event.clientY - dragOffsetRef.current.y;
    setPosition(clampPosition(nextX, nextY));
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!isDragging) return;

    setIsDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
    globalThis.localStorage.setItem(CONTRAST_POSITION_STORAGE_KEY, JSON.stringify(position));

    globalThis.setTimeout(() => {
      hasMovedRef.current = false;
    }, 0);
  };

  return (
    <>
      <div className="skip-links" aria-label="Atalhos de acessibilidade">
        <a
          className="skip-link"
          href="#conteudo-principal"
          onClick={(event) => {
            event.preventDefault();
            focusTarget("content");
          }}
        >
          Ir para conteudo (Alt + 1)
        </a>
        <a
          className="skip-link"
          href="#menu-principal"
          onClick={(event) => {
            event.preventDefault();
            focusTarget("menu");
          }}
        >
          Ir para menu (Alt + 2)
        </a>
        <a
          className="skip-link"
          href="#rodape-site"
          onClick={(event) => {
            event.preventDefault();
            focusTarget("footer");
          }}
        >
          Ir para rodape (Alt + 3)
        </a>
      </div>

      <button
        type="button"
        onClick={toggleContrast}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="contrast-toggle"
        aria-pressed={highContrast}
        aria-label={highContrast ? "Desativar alto contraste" : "Ativar alto contraste"}
        style={{ left: `${position.x}px`, top: `${position.y}px`, right: "auto", bottom: "auto" }}
      >
        {highContrast ? "Contraste: ligado" : "Contraste: normal"}
      </button>
    </>
  );
};

export default PortalAccessibility;
