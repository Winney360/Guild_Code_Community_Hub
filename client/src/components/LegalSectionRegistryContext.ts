import { createContext } from 'react';

export type SectionRegisterFn = (el: HTMLElement | null, id: string) => void;

export const LegalSectionRegistryContext = createContext<SectionRegisterFn>(() => {});
