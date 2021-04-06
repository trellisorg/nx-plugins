import { RehydrationRootConfig } from '@trellisorg/ngrx-universal-rehydrate';
import { INIT, MetaReducer } from '@ngrx/store';
import { createTransferStateKey, mergeStates } from './utils';
import { isPlatformBrowser } from '@angular/common';
import { TransferState } from '@angular/platform-browser';
import { TRANSFERRED_STATES } from './tokens';

export function browserRehydrateReducer(
    platformId: Object,
    _transferStateService: TransferState,
    config: RehydrationRootConfig
): MetaReducer<unknown> {
    const isBrowser = isPlatformBrowser(platformId);

    if (isBrowser) {
        /**
         * This will grab from the transferred state all of the state keys created by this library for the root
         * and any features that were added
         */
        const statesTransferred = _transferStateService.get(
            TRANSFERRED_STATES,
            []
        );

        /**
         * Only return a reducer that will attempt to rehydrate the state if there were states transferred to begin with
         */
        if (statesTransferred.length > 0) {
            return (reducer) => (state, action) => {
                if (action.type === INIT) {
                    /**
                     * Will loop over each transfer state key created by this library and pull the transferred state
                     * (if any) from the TransferState and then reduce it into a single object to merge into the
                     * store on INIT.
                     */
                    const rehydratedState = statesTransferred.reduce(
                        (prev, transferKey) => ({
                            ...prev,
                            ..._transferStateService.get(transferKey, {}),
                        }),
                        {}
                    );

                    const merged =
                        mergeStates(
                            state,
                            rehydratedState,
                            config.mergeStrategy
                        ) || {};

                    return reducer(merged, action);
                }

                return reducer(state, action);
            };
        }
    }

    /**
     * If the app is not in the browser or if there were no transferred states then return a meta reducer
     * that does not don anything to the state
     */
    return (reducer) => (state, action) => reducer(state, action);
}

/**
 * Will run while in Universal to store the state for that slice in the transfer state
 * @param platformId
 * @param stores
 * @param _transferState
 */
export function hydrateMetaReducer(
    platformId: Object,
    stores: string[],
    _transferState: TransferState
): MetaReducer<unknown> {
    const isBrowser = isPlatformBrowser(platformId);
    const stateKey = createTransferStateKey(stores || []);

    if (isBrowser) {
        return (reducer) => (state, action) => reducer(state, action);
    }

    /**
     * If we are in the server environment return the meta reducer that will save the updated states into the transfer
     * state based on the store slices configured.
     */
    return (reducer) => (state, action) => {
        const newState = reducer(state, action);

        if (newState) {
            /**
             * Only persist state for store slices that are configured
             * TODO: Optimize this
             */
            const reducedStore =
                stores?.length > 0
                    ? stores.reduce(
                          (prev, cur) => ({
                              ...prev,
                              [cur]: newState[cur],
                          }),
                          {}
                      )
                    : newState;

            _transferState.set(stateKey, reducedStore);

            return newState;
        }

        return reducer(state, action);
    };
}
