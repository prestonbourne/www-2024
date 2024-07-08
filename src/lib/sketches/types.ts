import { ComponentType } from "react";

export type Sketch = {
    id: string;
    Component: ComponentType;
} & SketchMetaData;

export type SketchMetaData = {
    title: string;
    description: string;
    imageUrl?: string;
}