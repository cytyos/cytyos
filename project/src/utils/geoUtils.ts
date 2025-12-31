import * as turf from '@turf/turf';

export function calculatePolygonArea(coordinates: number[][][]): number {
  if (!coordinates || coordinates.length === 0) return 0;

  const ring = coordinates[0];
  if (!ring || ring.length < 3) return 0;

  let area = 0;
  const earthRadius = 6371000;

  for (let i = 0; i < ring.length - 1; i++) {
    const [lon1, lat1] = ring[i];
    const [lon2, lat2] = ring[i + 1];

    const lat1Rad = (lat1 * Math.PI) / 180;
    const lat2Rad = (lat2 * Math.PI) / 180;
    const lon1Rad = (lon1 * Math.PI) / 180;
    const lon2Rad = (lon2 * Math.PI) / 180;

    area += (lon2Rad - lon1Rad) * (2 + Math.sin(lat1Rad) + Math.sin(lat2Rad));
  }

  area = (Math.abs(area) * earthRadius * earthRadius) / 2;

  return Math.round(area * 100) / 100;
}

export function formatArea(area: number): string {
  if (area >= 10000) {
    return `${(area / 10000).toFixed(2)} ha`;
  }
  return `${area.toFixed(2)} m²`;
}

function calculateCentroid(coordinates: number[][]): [number, number] {
  let sumLon = 0;
  let sumLat = 0;
  const points = coordinates.slice(0, -1);

  for (const [lon, lat] of points) {
    sumLon += lon;
    sumLat += lat;
  }

  return [sumLon / points.length, sumLat / points.length];
}

function createTinyFallbackPolygon(coordinates: number[][][]): number[][][] {
  const ring = coordinates[0];
  const [centerLon, centerLat] = calculateCentroid(ring);

  const offset = 0.00001;

  return [[
    [centerLon - offset, centerLat - offset],
    [centerLon + offset, centerLat - offset],
    [centerLon + offset, centerLat + offset],
    [centerLon - offset, centerLat + offset],
    [centerLon - offset, centerLat - offset],
  ]];
}

export function applySetback(
  coordinates: number[][][],
  setbackMeters: number
): number[][][] | null {
  if (!coordinates || coordinates.length === 0) return coordinates;
  if (setbackMeters === 0) return coordinates;

  try {
    console.log(`🔧 Applying setback: ${setbackMeters}m`);

    const polygon = turf.polygon(coordinates);
    const originalArea = turf.area(polygon);
    console.log(`📏 Original area: ${originalArea.toFixed(2)} m²`);

    const cleanedPolygon = turf.rewind(polygon, { reverse: false });

    const buffered = turf.buffer(cleanedPolygon, -setbackMeters, { units: 'meters' });

    if (!buffered || !buffered.geometry) {
      console.warn(`⚠️ Buffer resulted in empty geometry (setback ${setbackMeters}m too large for this lot)`);
      return createTinyFallbackPolygon(coordinates);
    }

    let resultCoordinates: number[][][] | null = null;

    if (buffered.geometry.type === 'Polygon') {
      resultCoordinates = buffered.geometry.coordinates;
    } else if (buffered.geometry.type === 'MultiPolygon') {
      resultCoordinates = buffered.geometry.coordinates[0];
    }

    if (resultCoordinates) {
      const newArea = turf.area(turf.polygon(resultCoordinates));
      console.log(`✅ Setback applied! New area: ${newArea.toFixed(2)} m² (reduced by ${(originalArea - newArea).toFixed(2)} m²)`);
      return resultCoordinates;
    }

    return createTinyFallbackPolygon(coordinates);
  } catch (error) {
    console.error('❌ Error applying setback:', error);
    return createTinyFallbackPolygon(coordinates);
  }
}

export function scalePolygon(
  coordinates: number[][][],
  setbackMeters: number
): number[][][] {
  const result = applySetback(coordinates, setbackMeters);
  return result || coordinates;
}
