declare module "@lucky-canvas/react" {
  import { FC, RefObject, RefCallback } from "react";

  interface LuckyWheelProps {
    ref?: RefObject<any> | RefCallback<any>;
    width?: string | number;
    height?: string | number;
    blocks?: any[];
    prizes?: any[];
    buttons?: any[];
    defaultConfig?: {
      gutter?: number;
      [key: string]: any;
    };
    onStart?: () => void;
    onEnd?: () => void;
  }

  export const LuckyWheel: FC<LuckyWheelProps>;
}
