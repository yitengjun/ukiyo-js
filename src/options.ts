type Defaults = {
  readonly scale: number;
  readonly speed: number;
  readonly wrapperClass: string | null;
  readonly willChange: boolean;
  readonly externalRAF: boolean;
};

export const defaults: Defaults = {
  scale: 1.5,
  speed: 1.5,
  wrapperClass: null,
  willChange: false,
  externalRAF: false,
};
