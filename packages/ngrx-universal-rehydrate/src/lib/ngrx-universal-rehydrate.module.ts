import {
    Inject,
    ModuleWithProviders,
    NgModule,
    PLATFORM_ID,
} from '@angular/core';
import { META_REDUCERS } from '@ngrx/store';
import {
    createTransferStateKey,
    defaultRehydrationRootConfig,
    RehydrationRootConfig,
} from './utils';
import { TransferState } from '@angular/platform-browser';
import { RehydrationTrackingService } from './rehydration-tracking.service';
import { browserRehydrateReducer, hydrateMetaReducer } from './reducers';
import { FEATURE_STORES, REHYDRATE_ROOT_CONFIG } from './tokens';
import { RehydrationLogger } from './rehydration-logger';
import { isPlatformServer } from '@angular/common';

@NgModule({})
export class NgrxUniversalRehydrateRootModule {
    constructor() {}
}

@NgModule({})
export class NgrxUniversalRehydrateFeatureModule {
    constructor(
        private rehydrationTrackingService: RehydrationTrackingService,
        @Inject(FEATURE_STORES) private stores: string[],
        @Inject(PLATFORM_ID) platformId: Object
    ) {
        if (isPlatformServer(platformId))
            this.rehydrationTrackingService.addFeature(
                createTransferStateKey(this.stores)
            );
    }
}

@NgModule({})
export class NgrxUniversalRehydrateModule {
    static forRoot(
        config: Partial<RehydrationRootConfig>
    ): ModuleWithProviders<NgrxUniversalRehydrateRootModule> {
        return {
            ngModule: NgrxUniversalRehydrateRootModule,
            providers: [
                {
                    provide: REHYDRATE_ROOT_CONFIG,
                    useValue: {
                        ...defaultRehydrationRootConfig,
                        ...config,
                    },
                },
                {
                    provide: META_REDUCERS,
                    deps: [PLATFORM_ID, TransferState, REHYDRATE_ROOT_CONFIG],
                    useFactory: browserRehydrateReducer,
                    multi: true,
                },
                {
                    provide: META_REDUCERS,
                    deps: [PLATFORM_ID, TransferState],
                    useFactory: (platformId, _transferState) =>
                        hydrateMetaReducer(
                            platformId,
                            config.stores,
                            _transferState
                        ),
                    multi: true,
                },
                {
                    provide: RehydrationTrackingService,
                    useFactory: (logger, transferState, platformId) =>
                        new RehydrationTrackingService(
                            logger,
                            transferState,
                            createTransferStateKey(config.stores),
                            platformId
                        ),
                    deps: [RehydrationLogger, TransferState, PLATFORM_ID],
                },
                RehydrationLogger,
            ],
        };
    }

    static forFeature(
        stores: RehydrationRootConfig['stores']
    ): ModuleWithProviders<NgrxUniversalRehydrateFeatureModule> {
        return {
            ngModule: NgrxUniversalRehydrateFeatureModule,
            providers: [
                {
                    provide: META_REDUCERS,
                    deps: [PLATFORM_ID, TransferState],
                    useFactory: (platformId, _transferState) =>
                        hydrateMetaReducer(platformId, stores, _transferState),
                    multi: true,
                },
                {
                    provide: FEATURE_STORES,
                    useValue: stores,
                    multi: true,
                },
            ],
        };
    }
}
