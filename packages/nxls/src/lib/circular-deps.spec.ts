import { _findCircularDependencies } from './circular-deps';
import type { Dependencies } from './types';

describe('Circular Deps', () => {
    const app1 = 'app1';
    const lib1 = 'lib1';
    const lib2 = 'lib2';
    const lib3 = 'lib3';

    const projects = {
        [app1]: {
            targets: {},
            root: `apps/${app1}/src`,
        },
        [lib1]: {
            targets: {},
            root: `packages/${lib1}/src`,
        },
        [lib2]: {
            targets: {},
            root: `packages/${lib2}/src`,
        },
        [lib3]: {
            targets: {},
            root: `packages/${lib3}/src`,
        },
    };

    it('should have no circular dependencies', () => {
        const dependencies = {
            [app1]: [
                {
                    target: lib1,
                    source: app1,
                    type: 'static',
                },
            ],
            [lib1]: [],
            [lib2]: [],
            [lib3]: [],
        };

        expect(_findCircularDependencies(dependencies, {}, projects)).toEqual(
            []
        );
    });

    it('should find the shorted circular dep path', () => {
        const dependencies: Dependencies = {
            [app1]: [],
            [lib1]: [
                {
                    target: lib2,
                    source: lib1,
                    type: 'static',
                },
            ],
            [lib2]: [
                {
                    target: lib1,
                    source: lib2,
                    type: 'static',
                },
            ],
            [lib3]: [
                {
                    target: lib3,
                    source: lib3,
                    type: 'static',
                },
            ],
        };

        expect(_findCircularDependencies(dependencies, {}, projects)).toEqual([
            { path: [lib1, lib2, lib1], key: `${lib1} -> ${lib2} -> ${lib1}` },
            { path: [lib3, lib3], key: `${lib3} -> ${lib3}` },
        ]);
    });
});
