"use client";
import React, {
  useEffect,
  useState,
  useRef,
  type HTMLAttributes,
  type ReactNode,
  type RefObject,
} from "react";
import { useOnChange } from "@/lib/hooks";
import { cx as cn } from "class-variance-authority";

type TOCItemType = {
  title: ReactNode;
  url: string;
  depth: number;
};

type TOCThumb = [top: number, height: number];

const headingToIndentMap = {
  h1: 1,
  h2: 2,
  h3: 3,
  h4: 4,
};

export function TableOfContents(): React.ReactElement {
  const viewRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<{
    path: string;
    width: number;
    height: number;
  }>();

  const [headings, setHeadings] = useState<TOCItemType[]>([]);
  const [visibleHeadings, setVisibleHeadings] = useState<Set<string>>(
    new Set()
  );

  useEffect(function collectHeadings() {
    const headingElements = Array.from(
      document.querySelectorAll("h1, h2, h3, h4")
    )
      .filter((heading) => heading.id)
      .map((heading) => ({
        id: heading.id,
        text: heading.textContent || "",
        depth: heading.tagName.toLowerCase(),
        top: (heading as HTMLElement).offsetTop,
      }));

    const tocItems = headingElements.map((heading) => {
      return {
        title: heading.text,
        url: `#${heading.id}`,
        // @ts-ignore
        depth: headingToIndentMap[heading.depth],
      };
    });

    setHeadings(tocItems);
  }, []);

  useEffect(
    function setupIntersectionObserver() {
      if (headings.length === 0) return;

      const handleIntersection = (entries: IntersectionObserverEntry[]) => {
        setVisibleHeadings((prevVisible) => {
          const visibleSet = new Set(prevVisible);

          for (const entry of entries) {
            const headingId = entry.target.id;
            if (entry.isIntersecting) {
              visibleSet.add(headingId);
            } else {
              visibleSet.delete(headingId);
            }
          }

          return visibleSet;
        });
      };

      const observer = new IntersectionObserver(handleIntersection, {
        root: null,
        threshold: 0,
      });

      headings.forEach((heading) => {
        const element = document.querySelector(heading.url);
        if (element) {
          observer.observe(element);
        }
      });

      return () => observer.disconnect();
    },
    [headings]
  );

  useEffect(
    function setupResizeObserver() {
      if (!containerRef.current) return;
      const container = containerRef.current;
      // Function to handle resizing of the container and update SVG accordingly
      function onResize(): void {
        if (container.clientHeight === 0) return;
        let w = 0; // width
        let h = 0; // height
        const d: string[] = []; // Array to hold SVG path commands
        for (let i = 0; i < headings.length; i++) {
          const element: HTMLElement | null = document.querySelector(
            `a[href="${headings[i].url}"]`
          );
          console.log({
            element,
          });

          if (!element) continue;
          const styles = getComputedStyle(element);

          const offset = getLineOffset(headings[i].depth) + 1,
            top = element.offsetTop + parseFloat(styles.paddingTop),
            bottom =
              element.offsetTop +
              element.clientHeight -
              parseFloat(styles.paddingBottom);
          w = Math.max(offset, w);
          h = Math.max(h, bottom);

          // Construct SVG path commands
          d.push(`${i === 0 ? "M" : "L"}${offset} ${top}`);
          d.push(`L${offset} ${bottom}`);
        }
        setSvg({
          path: d.join(" "),
          width: w + 1, // Add 1 to width for a small margin
          height: h,
        });
      }
      const observer = new ResizeObserver(onResize);
      onResize();
      observer.observe(container);
      return () => {
        observer.disconnect();
      };
    },
    [headings]
  );

  if (headings.length === 0) {
    return (
      <div className="rounded-lg border bg-purple-100 p-3 text-xs">
        No headings found
      </div>
    );
  }

  return (
    <div
      className={cn(
        "top-[10rem] right-auto left-[2rem] hidden",
        "xl:top-[6rem] xl:right-[6rem] xl:left-auto xl:block",
        "fixed mt-0 justify-start space-y-4 transition"
      )}
    >
      <div className="relative min-h-0" ref={viewRef}>
        {svg ? (
          <div
            className="absolute start-0 top-0 rtl:-scale-x-100"
            style={{
              width: svg.width,
              height: svg.height,
              maskImage: `url("data:image/svg+xml,${
                // Inline SVG
                encodeURIComponent(
                  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svg.width} ${svg.height}">
                    <path d="${svg.path}" stroke="black" stroke-width="1" fill="none" />
                  </svg>`
                )
              }")`,
            }}
          >
            <TocThumb
              active={Array.from(visibleHeadings)}
              containerRef={containerRef}
              className="mt-[var(--fd-top)] h-[var(--fd-height)] bg-slate-500 transition-all"
              data-testid="toc-thumb"
            />
          </div>
        ) : null}
        <div ref={viewRef}>
          <div className="flex flex-col" ref={containerRef}>
            {headings.map((heading, i) => (
              <TOCItem
                key={heading.url}
                isActive={visibleHeadings.has(heading.url.slice(1))}
                item={heading}
                upper={headings[i - 1]?.depth}
                lower={headings[i + 1]?.depth}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function getItemOffset(depth: number): number {
  if (depth <= 2) return 16;
  if (depth === 3) return 32;
  return 48;
}
function getLineOffset(depth: number): number {
  return depth >= 3 ? 12 : 0;
}

function update(element: HTMLElement, info: TOCThumb): void {
  element.style.setProperty("--fd-top", `${info[0]}px`);
  element.style.setProperty("--fd-height", `${info[1]}px`);
}

type TOCThumbProps = HTMLAttributes<HTMLDivElement> & {
  containerRef: RefObject<HTMLElement>;
  active: string[];
};

function TocThumb({
  containerRef,
  active,
  ...props
}: TOCThumbProps): ReactNode {
  const thumbRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const onResize = (): void => {
      if (!thumbRef.current) return;
      update(thumbRef.current, calc(container, activeRef.current));
    };

    onResize();

    const observer = new ResizeObserver(onResize);
    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [containerRef]);

  useOnChange(active, () => {
    if (!containerRef.current || !thumbRef.current) return;
    update(thumbRef.current, calc(containerRef.current, active));
  });
  return <div ref={thumbRef} role="none" {...props} />;
}

function TOCItem({
  isActive,
  item,
  upper = item.depth,
  lower = item.depth,
}: {
  isActive: boolean;
  item: TOCItemType;
  upper?: number;
  lower?: number;
}): React.ReactElement {
  const offset = getLineOffset(item.depth);
  const upperOffset = getLineOffset(upper);
  const lowerOffset = getLineOffset(lower);

  return (
    <a
      href={item.url}
      style={{
        paddingInlineStart: getItemOffset(item.depth),
      }}
      data-active={isActive}
      className="prose relative py-2 text-sm text-red-500 transition-colors [overflow-wrap:anywhere] first:pt-0 last:pb-0 data-[active=true]:text-red-100"
    >
      {offset !== upperOffset ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          className="absolute -top-2 start-0 size-4 rtl:-scale-x-100"
        >
          <line
            x1={upperOffset}
            y1="0"
            x2={offset}
            y2="16"
            className="stroke-purple-500/20"
            strokeWidth="1"
          />
        </svg>
      ) : null}
      <div
        className={cn(
          "absolute inset-y-0 w-px bg-purple-500/20",
          offset !== upperOffset && "top-2",
          offset !== lowerOffset && "bottom-2"
        )}
        style={{
          insetInlineStart: offset,
        }}
      />
      {item.title}
    </a>
  );
}

function calc(container: HTMLElement, active: string[]): TOCThumb {
  if (active.length === 0 || container.clientHeight === 0) {
    return [0, 0];
  }

  let upper = Number.MAX_VALUE,
    lower = 0;

  for (const item of active) {
    const element: HTMLElement | null = document.querySelector(
      `a[href="#${item}"]`
    );

    if (!element) continue;

    const styles = getComputedStyle(element);
    upper = Math.min(upper, element.offsetTop + parseFloat(styles.paddingTop));
    lower = Math.max(
      lower,
      element.offsetTop +
        element.clientHeight -
        parseFloat(styles.paddingBottom)
    );
  }

  return [upper, lower - upper];
}
