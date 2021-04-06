import { Inject, Injectable } from '@angular/core';
import { REHYDRATE_ROOT_CONFIG } from './tokens';
import { RehydrationRootConfig } from '@trellisorg/ngrx-universal-rehydrate';

@Injectable()
export class RehydrationLogger {
    constructor(
        @Inject(REHYDRATE_ROOT_CONFIG) private config: RehydrationRootConfig
    ) {}

    log(msg: string): void {
        if (!this.config.disableWarnings) {
            console.warn(`NgRx Universal Rehydration: ${msg}`);
        }
    }
}
