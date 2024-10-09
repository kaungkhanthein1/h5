declare module 'video-react' {
    import * as React from 'react';
  
    export class Player extends React.Component<any, any> {
      video: any;
      getState: () => any;
      subscribeToStateChange: (listener: (state: any, prevState: any) => void) => void;
      seek: (time: number) => void;
      toggleFullscreen: () => void;
    }
  
    export class ControlBar extends React.Component<any, any> {}
    export class BigPlayButton extends React.Component<any, any> {}
    export class ProgressControl extends React.Component<any, any> {}
    export class FullscreenToggle extends React.Component<any, any> {}
    export class CurrentTimeDisplay extends React.Component<any, any> {}
    export class DurationDisplay extends React.Component<any, any> {}
  }
  