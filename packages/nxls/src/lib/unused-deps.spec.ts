import type { ProjectConfiguration } from '@nrwl/tao/src/shared/workspace';
import { _findUnusedDependencies } from './unused-deps';

describe('Unused Deps', () => {
    const app1 = 'app1';
    const lib1 = 'lib1';

    const workspaceJson: Record<string, ProjectConfiguration> = {
        [app1]: {
            targets: {},
            root: '',
            projectType: 'application',
        },
        [lib1]: {
            targets: {},
            root: '',
            projectType: 'library',
        },
    };

    it('should not find any unused deps', () => {
        const dependencies = {
            [app1]: [
                {
                    target: lib1,
                    source: app1,
                    type: 'static',
                },
            ],
            [lib1]: [],
        };

        expect(
            _findUnusedDependencies(dependencies, workspaceJson, {
                excludeExternal: false,
            })
        ).toEqual([]);
    });

    it('should find lib1 as unused', () => {
        const dependencies = {
            [app1]: [],
            [lib1]: [],
        };

        expect(
            _findUnusedDependencies(dependencies, workspaceJson, {
                excludeExternal: false,
            })
        ).toEqual([lib1]);
    });
});
