import { Injectable } from '@angular/core';
import { TransferState } from '@angular/platform-browser';
import { TRANSFERRED_STATES } from './tokens';
import { RehydrationLogger } from './rehydration-logger';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class RehydrationTrackingService {
    private readonly _stores: Set<string>;

    private isBrowser: boolean;

    constructor(
        private logger: RehydrationLogger,
        private _transferState: TransferState,
        private rootStoreKey: string,
        private platformId: Object
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);

        if (!this.isBrowser) {
            this._stores = new Set<string>();
            this._stores.add(rootStoreKey);
            this.logger.log(`Registering root state key: ${this.rootStoreKey}`);
            this.setState();
        } else {
            this.logger.log(
                `Running in platform ${this.platformId}, not tracking state to be rehydrated.`
            );
        }
    }

    private setState(): void {
        this.logger.log(
            `Setting list of states to be transferred: ${[...this._stores]}`
        );
        this._transferState.set(TRANSFERRED_STATES, [...this._stores]);
    }

    addFeature(key: string): void {
        this.logger.log(`Adding feature: ${key}`);
        this._stores.add(key);
        this.setState();
    }

    addFeatures(keys: string[]): void {
        this.logger.log(`Adding features: ${keys}`);
        keys.forEach((key) => this._stores.add(key));
        this.setState();
    }

    removeFeature(key: string): void {
        this.logger.log(`Removing feature: ${key}`);
        this._stores.delete(key);
        this.setState();
    }

    removeFeatures(keys: string[]): void {
        this.logger.log(`Removing features: ${keys}`);
        keys.forEach((key) => this._stores.delete(key));
        this.setState();
    }
}
