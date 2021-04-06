import { merge, mergeStates, MergeStrategy } from './utils';

describe('Utils', () => {
    describe('merge', () => {
        it('should merge one object over the other', () => {
            expect(merge({ 1: 1, 2: 2 }, { 1: 2 })).toEqual({
                1: 1,
                2: 2,
            });
        });
    });

    describe('mergeStates', () => {
        const initial = { 1: 1, 2: 2 };
        const transfer = { 1: 2 };

        it('should overwrite the state', () => {
            expect(
                mergeStates(initial, transfer, MergeStrategy.OVERWRITE)
            ).toEqual({
                1: 2,
            });
        });

        it('should merge over the state', () => {
            expect(
                mergeStates(initial, transfer, MergeStrategy.MERGE_OVER)
            ).toEqual({
                1: 2,
                2: 2,
            });
        });

        it('should merge under the state', () => {
            expect(
                mergeStates(initial, transfer, MergeStrategy.MERGE_UNDER)
            ).toEqual({ 1: 1, 2: 2 });
        });
    });
});
