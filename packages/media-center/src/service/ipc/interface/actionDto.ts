export interface ActionDTO<
  T extends Record<string, any> = Record<string, any>
> {
  type: string;
  payload: T;
  forward: string[];
}
