import { Inject, NgModule, PLATFORM_ID } from '@angular/core';
import {
    BrowserModule,
    BrowserTransferStateModule,
} from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { Store, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { NgrxUniversalRehydrateModule } from '@trellisorg/ngrx-universal-rehydrate';
import { loadData, titleReducer } from './store';
import { EffectsModule } from '@ngrx/effects';
import { Effects } from './effects';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule.withServerTransition({ appId: 'serverApp' }),
        StoreModule.forRoot(
            { root: titleReducer },
            {
                runtimeChecks: {
                    strictStateSerializability: false,
                },
            }
        ),
        EffectsModule.forRoot([Effects]),
        NgrxUniversalRehydrateModule.forRoot({
            stores: ['root'],
            disableWarnings: false,
        }),
        StoreDevtoolsModule.instrument({}),
        BrowserTransferStateModule,
        HttpClientModule,
        HttpClientJsonpModule,
        RouterModule.forRoot([
            {
                path: 'feature1',
                loadChildren: () =>
                    import('./feature1/feature1.module').then(
                        (m) => m.Feature1Module
                    ),
            },
            {
                path: 'feature2',
                loadChildren: () =>
                    import('./feature2/feature2.module').then(
                        (m) => m.Feature2Module
                    ),
            },
        ]),
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private _store: Store
    ) {
        if (!isPlatformBrowser(platformId)) this._store.dispatch(loadData());
    }
}
