declare module 'react-signature-canvas' {
  import { Component, RefObject } from 'react';

  export interface SignatureCanvasProps {
    canvasProps?: React.CanvasHTMLAttributes<HTMLCanvasElement>;
    backgroundColor?: string;
    penColor?: string;
    velocityFilterWeight?: number;
    minWidth?: number;
    maxWidth?: number;
    throttle?: number;
    minDistance?: number;
    dotSize?: number | (() => number);
    onEnd?: () => void;
    onBegin?: () => void;
    clearOnResize?: boolean;
  }

  export default class SignatureCanvas extends Component<SignatureCanvasProps> {
    clear(): void;
    isEmpty(): boolean;
    fromDataURL(dataURL: string): void;
    toDataURL(type?: string, encoderOptions?: number): string;
    fromData(data: number[][]): void;
    toData(): number[][];
    getCanvas(): HTMLCanvasElement;
    getTrimmedCanvas(): HTMLCanvasElement;
  }
}
