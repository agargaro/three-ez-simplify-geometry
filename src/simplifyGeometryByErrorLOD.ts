import { BufferGeometry } from 'three';
import { simplifyGeometryByError } from './SimplifyGeometryByError.js';

// export const performanceLOD = [0.005, 0.012, 0.04, 0.08];
export const balancedLOD = [0.005, 0.01, 0.04, 0.08];
// export const qualityLOD = [0.003, 0.008, 0.03, 0.08];

export async function simplifyGeometryByErrorLOD(geometry: BufferGeometry, LODCount: number, range = balancedLOD): Promise<BufferGeometry[]> {
  const geometries: BufferGeometry[] = [geometry];

  for (let i = 0; i < LODCount; i++) {
    geometries.push(await simplifyGeometryByError(geometry, range[i]));
  }

  return geometries;
}

export async function simplifyGeometriesByErrorLOD(geometries: BufferGeometry[], LODCounts: number | number[], ranges: number[] | number[][] = balancedLOD): Promise<BufferGeometry[][]> {
  const result: BufferGeometry[][] = [];

  for (let i = 0; i < geometries.length; i++) {
    const range = (Array.isArray(ranges[i]) ? ranges[i] : ranges) as number[];
    const LODCount = Array.isArray(LODCounts) ? LODCounts[i] : LODCounts;
    result.push(await simplifyGeometryByErrorLOD(geometries[i], LODCount, range));
  }

  return result;
}
