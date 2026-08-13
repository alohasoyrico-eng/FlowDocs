declare module "react" {
  export type ReactNode =
    | string
    | number
    | boolean
    | null
    | undefined
    | ReactElement
    | ReactNode[];

  export interface ReactElement {
    readonly type: unknown;
    readonly props: unknown;
    readonly key: string | number | null;
  }

  export interface RefAttributes<T> {
    ref?: unknown;
  }

  export interface ForwardRefExoticComponent<P> {
    (props: P): ReactElement | null;
  }

  export interface SyntheticEvent<T = Element> {
    currentTarget: T;
    defaultPrevented: boolean;
    preventDefault(): void;
  }

  export interface MouseEvent<T = Element> extends SyntheticEvent<T> {}

  export interface HTMLAttributes<T = Element> {
    id?: string;
    role?: string;
    className?: string;
    children?: ReactNode;
    onClick?: (event: MouseEvent<T>) => void;
    "aria-label"?: string;
    "aria-describedby"?: string;
    "aria-labelledby"?: string;
  }

  export interface ButtonHTMLAttributes<T = HTMLButtonElement> extends HTMLAttributes<T> {
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
  }
}
