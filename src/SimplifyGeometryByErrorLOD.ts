import { BufferGeometry } from 'three';
import { simplifyGeometryByError } from './SimplifyGeometryByError.js';

export const performanceRangeLOD = [0.01, 0.02, 0.05, 0.1];
export const balancedRangeLOD = [0.007, 0.015, 0.04, 0.08];
export const qualityRangeLOD = [0.004, 0.01, 0.035, 0.07];

export async function simplifyGeometryByErrorLOD(geometry: BufferGeometry, LODCount: number, range = balancedRangeLOD): Promise<BufferGeometry[]> {
  const geometries: BufferGeometry[] = [geometry];

  for (let i = 0; i < LODCount; i++) {
    geometries.push(await simplifyGeometryByError(geometry, range[i]));
  }

  return geometries;
}

export async function simplifyGeometriesByErrorLOD(geometries: BufferGeometry[], LODCounts: number | number[], ranges: number[] | number[][] = balancedRangeLOD): Promise<BufferGeometry[][]> {
  const result: BufferGeometry[][] = [];

  for (let i = 0; i < geometries.length; i++) {
    const range = (Array.isArray(ranges[i]) ? ranges[i] : ranges) as number[];
    const LODCount = Array.isArray(LODCounts) ? LODCounts[i] : LODCounts;
    result.push(await simplifyGeometryByErrorLOD(geometries[i], LODCount, range));
  }

  return result;
}
