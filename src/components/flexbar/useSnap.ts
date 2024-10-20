import { useRef, useState, useCallback } from "react";
import {
  BoundingBox,
  MotionProps,
  DragHandlers,
  animate,
  SpringOptions,
  DragElastic,
} from "framer-motion";

export type Point = {
  x?: number;
  y?: number;
};

export type SnapPointsType =
  | { type: "absolute"; points: Point[] }
  | {
      // Based on constraints box
      type: "constraints-box";
      unit: "pixel" | "percent";
      points: Point[];
    }
  | {
      // Relative to initial position
      type: "relative-to-initial";
      points: Point[];
    };

export type SnapOptions = {
  /**
   * Controls the "slipperiness" of the element.
   * Higher values make the element slide farther, while lower values give it less momentum.
   * Default is 0.1.
   */
  power?: number;
  direction: "x" | "y" | "both";
  ref: React.RefObject<HTMLElement>;
  snapPoints: SnapPointsType;
  springOptions?: Omit<SpringOptions, "velocity">;
  constraints?: Partial<BoundingBox> | React.RefObject<Element>;
  dragElastic?: DragElastic;
  onDragStart?: MotionProps["onDragStart"];
  onDragEnd?: MotionProps["onDragEnd"];
  onMeasureDragConstraints?: MotionProps["onMeasureDragConstraints"];
};

export type UseSnapResult = {
  dragProps: Pick<
    MotionProps,
    | "drag"
    | "onDragStart"
    | "onDragEnd"
    | "onMeasureDragConstraints"
    | "dragMomentum"
  > &
    Partial<Pick<MotionProps, "dragConstraints">>;
  snapTo: (index: number) => void;
  currentSnappointIndex: number | null;
};

const minmax = (num: number, min: number, max: number) =>
  Math.max(Math.min(max, num), min);

export const useSnap = ({
  power = 0.01,
  direction,
  snapPoints,
  ref,
  springOptions = {},
  constraints,
  dragElastic,
  onDragStart,
  onDragEnd,
  onMeasureDragConstraints,
}: SnapOptions): UseSnapResult => {
  const stableSnapPoints = useRef(snapPoints);
  const stableSpringOptions = useRef(springOptions);

  const constraintsBoxRef = useRef<BoundingBox | null>(null);
  const [currentSnappointIndex, setCurrentSnappointIndex] = useState<
    number | null
  >(null);


  const resolveConstraints = useCallback(() => {
    if (constraints === undefined) {
      return null;
    }

    if (!ref.current) {
      throw new Error("Element ref is empty");
    }

    const box =
      "current" in constraints ? constraintsBoxRef.current : constraints;
    if (!box) {
      throw new Error("Constraints wasn't measured");
    }

    const { base } = computeElementPos(ref.current);

    const left = box.left !== undefined ? base.x + box.left : undefined;
    const top = box.top !== undefined ? base.y + box.top : undefined;

    const right = box.right !== undefined ? base.x + box.right : undefined;
    const bottom = box.bottom !== undefined ? base.y + box.bottom : undefined;

    const width =
      left !== undefined && right !== undefined ? right - left : undefined;
    const height =
      top !== undefined && bottom !== undefined ? bottom - top : undefined;

    return {
      left,
      top,
      width,
      height,
      right,
      bottom,
    };
  }, [constraints, ref]);

  const convertSnapPoints = useCallback(
    (snapPoints: SnapPointsType) => {
      if (!ref.current) {
        console.error('Element Ref Empty')
        return
      }

      if (snapPoints.type === "absolute") {
        return snapPoints.points;
      }

      if (snapPoints.type === "relative-to-initial") {
        // Same trick as before
        const { base } = computeElementPos(ref.current);

        return snapPoints.points.map((p) => {
          return {
            x: p.x === undefined ? undefined : base.x + p.x,
            y: p.y === undefined ? undefined : base.y + p.y,
          };
        });
      } else if (snapPoints.type === "constraints-box") {
        if (constraints === undefined) {
          throw new Error(
            `When using snapPoints type constraints-box, you must provide 'constraints' property`
          );
        }

        const box = resolveConstraints();
        if (!box) {
          throw new Error("Constraints wasn't measured");
        }

        if (
          ["x", "both"].includes(direction) &&
          (box.left === undefined || box.right === undefined)
        ) {
          throw new Error(
            `constraints should describe both sides for each used drag direction`
          );
        }
        if (
          ["y", "both"].includes(direction) &&
          (box.top === undefined || box.bottom === undefined)
        ) {
          throw new Error(
            `constraints should describe both sides for each used drag direction`
          );
        }
        return snapPoints.points.map((p) => {
          const result: Point = {};
          if (p.x !== undefined) {
            if (snapPoints.unit === "pixel") {
              result.x = box.left! + p.x;
            } else {
              result.x = box.left! + box.width! * p.x;
            }
          }
          if (p.y !== undefined) {
            if (snapPoints.unit === "pixel") {
              result.y = box.top! + p.y;
            } else {
              result.y = box.top! + box.height! * p.y;
            }
          }

          return result;
        });
      }
    },
    [ref, constraints, direction, resolveConstraints]
  );


  const onDragEndHandler: DragHandlers["onDragEnd"] = (event, info) => {
    onDragEnd?.(event, info);

    if (!ref.current) {
      throw new Error("element ref is not set");
    }

    const points = convertSnapPoints(stableSnapPoints.current);
    if (!points) {
      throw new Error(`snap points weren't calculated on drag start`);
    }

    const { elementBox, base } = computeElementPos(ref.current);

    // Snapping
    const dropCoordinates = {
      x: window.scrollX + elementBox.x,
      y: window.scrollY + elementBox.y,
    };

    const afterInertia = {
      x: dropCoordinates.x + info.velocity.x * power,
      y: dropCoordinates.y + info.velocity.y * power,
    };

    const distances = points.map((p) => {
      if (p.x !== undefined && p.y !== undefined) {
        // https://en.wikipedia.org/wiki/Euclidean_distance
        return Math.sqrt(
          Math.pow(p.x - afterInertia.x, 2) + Math.pow(p.y - afterInertia.y, 2)
        );
      }
      if (p.x !== undefined) return Math.abs(p.x - afterInertia.x);
      if (p.y !== undefined) return Math.abs(p.y - afterInertia.y);
      return 0;
    });

    const minDistance = Math.min(...distances);
    const minDistanceIndex = distances.indexOf(minDistance);
    setCurrentSnappointIndex(minDistanceIndex);
    const selectedPoint = points[minDistanceIndex];

    const constraintsBox = resolveConstraints();
    const afterInertiaClamped = {
      x: minmax(
        afterInertia.x,
        constraintsBox?.left ?? -Infinity,
        constraintsBox?.right ?? Infinity
      ),
      y: minmax(
        afterInertia.y,
        constraintsBox?.top ?? -Infinity,
        constraintsBox?.bottom ?? Infinity
      ),
    };

    // After afterInertiaClamped calculations, but before `target`, the further we go out of bounds, the harder the snap back
    const dragElasticResolved = (() => {
      if (typeof dragElastic === "number")
        return {
          top: dragElastic,
          left: dragElastic,
          right: dragElastic,
          bottom: dragElastic,
        };
      if (typeof dragElastic === "object")
        return { top: 0, left: 0, right: 0, bottom: 0, ...dragElastic };
      if (dragElastic === false)
        return { top: 0, left: 0, right: 0, bottom: 0 };
      else return { top: 0.5, left: 0.5, right: 0.5, bottom: 0.5 };
    })();
    const overshootCoefficient = { x: 1, y: 1 };
    const overshootDecreaseCoefficient = 0.999;

    if (
      constraintsBox?.left !== undefined &&
      afterInertia.x < constraintsBox.left
    ) {
      const dist = Math.abs(constraintsBox.left - afterInertia.x);
      overshootCoefficient.x =
        Math.pow(overshootDecreaseCoefficient, dist) * dragElasticResolved.left;
    }
    if (
      constraintsBox?.right !== undefined &&
      afterInertia.x > constraintsBox.right
    ) {
      const dist = Math.abs(afterInertia.x - constraintsBox.right);
      overshootCoefficient.x =
        Math.pow(overshootDecreaseCoefficient, dist) *
        dragElasticResolved.right;
    }
    if (
      constraintsBox?.top !== undefined &&
      afterInertia.y < constraintsBox.top
    ) {
      const dist = Math.abs(constraintsBox.top - afterInertia.y);
      overshootCoefficient.y =
        Math.pow(overshootDecreaseCoefficient, dist) * dragElasticResolved.top;
    }
    if (
      constraintsBox?.bottom !== undefined &&
      afterInertia.y > constraintsBox.bottom
    ) {
      const dist = Math.abs(afterInertia.y - constraintsBox.bottom);
      overshootCoefficient.y =
        Math.pow(overshootDecreaseCoefficient, dist) *
        dragElasticResolved.bottom;
    }

    /* 
    Values for `translateX/Y` to move element to selected point
    we use afterInertiaClamped to make sure we don't move to a point outside of the constraints box
    */
    const target = {
      x: !!selectedPoint.x
        ? selectedPoint.x - base.x
        : afterInertiaClamped.x - base.x,

      y: !!selectedPoint.y
        ? selectedPoint.y - base.y
        : afterInertiaClamped.y - base.y,
    };

    // We should animate element coordinate only if drag is enabled for this axis
    if (direction === "x" || direction === "both") {
      animate(
        ref.current,
        { x: target.x },
        {
          ...stableSpringOptions.current,
          type: "spring",
          velocity: info.velocity.x,
        }
      );
    }

    if (direction === "y" || direction === "both") {
      animate(
        ref.current,
        { y: target.y },
        {
          ...stableSpringOptions.current,
          type: "spring",
          velocity: info.velocity.y,
        }
      );
    }
  };

  const snapTo = useCallback(
    (index: number) => {
      const convertedSnapPoints = convertSnapPoints(stableSnapPoints.current);

      if (!convertedSnapPoints || !ref.current) {
        return;
      }
      const selectedPoint = convertedSnapPoints[index];
      if (!selectedPoint) {
        return;
      }

      const { base } = computeElementPos(ref.current);
      setCurrentSnappointIndex(index);

      if (selectedPoint.x !== undefined) {
        animate(
          ref.current,
          { x: selectedPoint.x - base.x },
          {
            ...stableSpringOptions.current,
            type: "spring",
          }
        );
      }

      if (selectedPoint.y !== undefined) {
        animate(
          ref.current,
          { y: selectedPoint.y - base.y },
          {
            ...stableSpringOptions.current,
            type: "spring",
          }
        );
      }
    },
    [ref, convertSnapPoints, stableSpringOptions]
  );

  const dragProps: Partial<MotionProps> & React.CSSProperties = {
    drag: direction === "both" ? true : direction,
    onDragEnd: (e, info) => {
      onDragEndHandler?.(e, info);
    },
    onMeasureDragConstraints(constraints) {
      constraintsBoxRef.current = constraints;
      onMeasureDragConstraints?.(constraints);
    },

    dragMomentum: false, // We'll handle this ourselves
    dragConstraints: constraints,
    onDragStart: (event, info) => {
      // Reset currentSnappointIndex when the user starts dragging an element
      setCurrentSnappointIndex(null);
      onDragStart?.(event, info);
    },
  };
  return { dragProps, currentSnappointIndex, snapTo  };
};

export const computeElementPos = (elemRef: HTMLElement) => {
  const elementBox = elemRef.getBoundingClientRect();
  const style = window.getComputedStyle(elemRef);
  const transformMatrix = new DOMMatrixReadOnly(style.transform);
  const translate = { x: transformMatrix.e, y: transformMatrix.f };

  const base = {
    x: window.scrollX + elementBox.x - translate.x,
    y: window.scrollY + elementBox.y - translate.y,
  };

  return { elementBox, translate, base };
};
