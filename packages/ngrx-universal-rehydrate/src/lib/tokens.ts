import { InjectionToken } from '@angular/core';
import { makeStateKey } from '@angular/platform-browser';
import { RehydrationRootConfig } from '@trellisorg/ngrx-universal-rehydrate';

export const REHYDRATE_ROOT_CONFIG = new InjectionToken<RehydrationRootConfig>(
    'ngrxUniversalHydrateRootConfig'
);

export const TRANSFERRED_STATES = makeStateKey<string[]>(
    'ngrxUniversalStatesTransferred'
);

export const FEATURE_STORES = new InjectionToken<string[]>(
    'ngrxUniversalHydrateFeatureState'
);
