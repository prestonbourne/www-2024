import { ComponentType } from "react";

export type Sketch = {
    id: string;
    type: "sketch";
    Component: ComponentType;
} & SketchMetaData;

 /* 
  Why SketchesLite instead of a single Sketch type? this is a good read
  https://frontendatscale.com/blog/donut-components/
  it just comes down to the fact that next.js cannot serialize a react component so passing it as props is out of the question
*/
export type SketchLite = Omit<Sketch, "Component">;

export type SketchMetaData = {
    title: string;
    description: string;
    imageUrl?: string;
    publishedAt: string // {YYYY}-{MM}-{DD}
}