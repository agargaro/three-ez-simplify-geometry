import { BufferGeometry } from 'three';
import { simplifyGeometry } from './aSimplifyGeometry.js';

export async function simplifyGeometryByError(geometry: BufferGeometry, appearanceError: number): Promise<BufferGeometry> {
  return simplifyGeometry(geometry, { ratio: 0, error: appearanceError });
}

export async function simplifyGeometriesByError(geometries: BufferGeometry[], appearanceErrorList: number | number[]): Promise<BufferGeometry[]> {
  const result: BufferGeometry[] = new Array(geometries.length);

  for (let i = 0; i < geometries.length; i++) {
    const appearanceError = Array.isArray(appearanceErrorList) ? appearanceErrorList[i] : appearanceErrorList;
    result[i] = await simplifyGeometryByError(geometries[i], appearanceError);
  }

  return result;
}
