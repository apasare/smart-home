import { INTENT_HANDLER_METADATA } from './constants';

export const IntentHandler = (): ClassDecorator => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (target: object): void => {
    Reflect.defineMetadata(INTENT_HANDLER_METADATA, true, target);
  };
};
