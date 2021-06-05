import { Dependencies } from './types';
import { percentSubSet, readOrGenerateDepFile } from './util';

export interface DependencyOverlapConfig {
    threshold: number;
}

/**
 * Calculate the % overlap of all libraries with other libraries.
 */
export function calcDependencyOverlap(
    config: DependencyOverlapConfig
): {
    outerDep: string;
    innerDep: string;
    percent: number;
}[] {
    const dependencies = readOrGenerateDepFile().dependencies;

    return _calcDependencyOverlap(config, dependencies);
}

export function _calcDependencyOverlap(
    { threshold }: DependencyOverlapConfig,
    dependencies: Dependencies
): {
    outerDep: string;
    innerDep: string;
    percent: number;
}[] {
    const deps: Record<string, string[]> = Object.entries(dependencies).reduce(
        (prev, [depName, depArray]) => ({
            ...prev,
            [depName]: depArray.map((dep) => dep.target),
        }),
        {}
    );

    const subsetPercents: {
        outerDep: string;
        innerDep: string;
        percent: number;
    }[] = [];

    const depKeys: string[] = Object.keys(deps);

    depKeys.forEach((outerKey) => {
        depKeys.forEach((innerKey) => {
            if (
                deps[outerKey].length > deps[innerKey].length &&
                outerKey !== innerKey
            ) {
                const record = {
                    outerDep: outerKey,
                    innerDep: innerKey,
                    percent: percentSubSet(deps[outerKey], deps[innerKey]),
                };
                if (record.percent > threshold / 100) {
                    subsetPercents.push(record);
                }
            }
        });
    });

    return subsetPercents;
}
