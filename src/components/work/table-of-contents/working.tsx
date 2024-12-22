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
        let width = 0, // Initialize width
          height = 0; // Initialize height
        const d: string[] = []; // Array to hold SVG path commands
        for (let i = 0; i < headings.length; i++) {
          const element: HTMLElement | null = document.querySelector(
            `a[href="${headings[i].url}"]`
          );

          if (!element) continue;
          const styles = getComputedStyle(element);

          const elemTop = element.offsetTop;
          const elemHeight = element.clientHeight;
          const paddingBot = parseFloat(styles.paddingBottom);
          const paddingTop = parseFloat(styles.paddingTop);

          console.log({
            element,
            elemHeight,
            elemTop,
            paddingBot,
            paddingTop,
          });

          const offset = getLineOffset(headings[i].depth) + 1;
          const top = elemTop + paddingTop;
          const bottom = elemTop + elemHeight - paddingBot;

          width = Math.max(offset, width);
          height = Math.max(height, bottom);

          // Construct SVG path commands
          d.push(`${i === 0 ? "M" : "L"}${offset} ${top}`);
          d.push(`L${offset} ${bottom}`);
        }
        setSvg({
          path: d.join(" "),
          width: width + 1, // Add 1 to width for a small margin
          height,
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
      <div className="rounded-lg border bg-purple-100 p-3 text-xs text-red-500">
        No headings found
      </div>
    );
  }
  console.log({
    svg,
  });

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
            className="absolute start-0 top-0 rtl:-scale-x-100 w-2"
            style={{
              width: svg.width,
              height: svg.height,
              maskImage: `url("data:image/svg+xml,${
                // Inline SVG
                encodeURIComponent(
                  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svg.width} ${svg.height}">
                    <path d="${svg.path}" stroke="green" stroke-width="1" fill="none" />
                  </svg>`
                )
              }")`,
            }}
          >
            <TocThumb
              active={Array.from(visibleHeadings)}
              containerRef={containerRef}
              className="mt-[var(--fd-top)] h-[var(--fd-height)] bg-red-500 transition-all"
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

export function TocThumb({
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
      className="relative py-2 text-sm text-slate-200 transition-colors [overflow-wrap:anywhere] first:pt-0 last:pb-0 data-[active=true]:text-red-100"
    >
      {offset !== upperOffset
        ? null
        :  <svg
             xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 16 16"
             className="absolute -top-2 start-0 size-4 rtl:-scale-x-100"
           >
             <line
               x1={upperOffset}
               y1="0"
               x2={offset}
               y2="16"
               className="stroke-red-500"
               strokeWidth="0"
            />
           </svg>
          }
      <div
        className={cn(
          "absolute inset-y-0 w-px bg-purple-500",
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
    console.log({
      item
    })
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
