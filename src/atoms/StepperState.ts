import { atom } from 'recoil';

export const currentStepper = atom({
  key: 'currentStepper', // unique ID (with respect to other atoms/selectors)
  default: 'Basic Details', // default value (aka initial value)
});