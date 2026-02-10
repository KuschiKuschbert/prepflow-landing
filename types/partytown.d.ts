declare module '@builder.io/partytown/react' {
  import { ComponentType } from 'react';

  export interface PartytownProps {
    debug?: boolean;
    forward?: string[];
    lib?: string;
    [key: string]: any;
  }

  export const Partytown: ComponentType<PartytownProps>;
}
