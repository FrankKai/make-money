import { lazy } from 'react';
import type { Route } from '../types';

export const routes: Route[] = [
  { 
    path: "/", 
    label: "Money", 
    component: lazy(() => import("../pages/makeMoney"))
  },
  { 
    path: "/rank", 
    label: "Rank", 
    component: lazy(() => import("../pages/rank"))
  }
] as const; 