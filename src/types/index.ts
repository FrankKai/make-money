import type { FC } from 'react';

export interface Route {
  path: string;
  label: string;
  component: FC;
}

export interface MakingMoneyProps {
  base: number;
  day: number;
  hour: number;
  alreadyBurnedHour?: number;
} 