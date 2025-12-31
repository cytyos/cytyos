import { createContext, useContext, useState, ReactNode } from 'react';

export interface VolumetriaBlock {
  id: string;
  name: string;
  height: number;
  setback: number;
}

interface MapContextType {
  terrainArea: number;
  setTerrainArea: (area: number) => void;
  terrainGeometry: number[][][] | null;
  setTerrainGeometry: (geometry: number[][][] | null) => void;
  coefficientCA: number;
  setCoefficient: (ca: number) => void;
  taxaOcupacao: number;
  setTaxaOcupacao: (taxa: number) => void;
  isDrawing: boolean;
  setIsDrawing: (drawing: boolean) => void;
  potencialConstrutivo: number;
  volumetriaBlocks: VolumetriaBlock[];
  setVolumetriaBlocks: (blocks: VolumetriaBlock[]) => void;
  constructionCostPerSqm: number;
  setConstructionCostPerSqm: (cost: number) => void;
  saleValuePerSqm: number;
  setSaleValuePerSqm: (value: number) => void;
  landValue: number;
  setLandValue: (value: number) => void;
  totalRevenue: number;
  totalCost: number;
  profitMargin: number;
  sunHour: number;
  setSunHour: (hour: number) => void;
  recuoFrontal: number;
  setRecuoFrontal: (recuo: number) => void;
  recuoLateral: number;
  setRecuoLateral: (recuo: number) => void;
  mapInstance: any;
  setMapInstance: (map: any) => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export function MapProvider({ children }: { children: ReactNode }) {
  const [terrainArea, setTerrainArea] = useState(0);
  const [terrainGeometry, setTerrainGeometry] = useState<number[][][] | null>(null);
  const [coefficientCA, setCoefficient] = useState(1.0);
  const [taxaOcupacao, setTaxaOcupacao] = useState(0.5);
  const [isDrawing, setIsDrawing] = useState(false);
  const [volumetriaBlocks, setVolumetriaBlocks] = useState<VolumetriaBlock[]>([
    { id: 'base', name: 'Base', height: 15, setback: 0 },
  ]);
  const [constructionCostPerSqm, setConstructionCostPerSqm] = useState(3500);
  const [saleValuePerSqm, setSaleValuePerSqm] = useState(8000);
  const [landValue, setLandValue] = useState(0);
  const [sunHour, setSunHour] = useState(12);
  const [recuoFrontal, setRecuoFrontal] = useState(0);
  const [recuoLateral, setRecuoLateral] = useState(0);
  const [mapInstance, setMapInstance] = useState<any>(null);

  const potencialConstrutivo = terrainArea * coefficientCA;
  const totalCost = potencialConstrutivo * constructionCostPerSqm;
  const totalRevenue = potencialConstrutivo * saleValuePerSqm;
  const profitMargin = totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue) * 100 : 0;

  return (
    <MapContext.Provider
      value={{
        terrainArea,
        setTerrainArea,
        terrainGeometry,
        setTerrainGeometry,
        coefficientCA,
        setCoefficient,
        taxaOcupacao,
        setTaxaOcupacao,
        isDrawing,
        setIsDrawing,
        potencialConstrutivo,
        volumetriaBlocks,
        setVolumetriaBlocks,
        constructionCostPerSqm,
        setConstructionCostPerSqm,
        saleValuePerSqm,
        setSaleValuePerSqm,
        landValue,
        setLandValue,
        totalRevenue,
        totalCost,
        profitMargin,
        sunHour,
        setSunHour,
        recuoFrontal,
        setRecuoFrontal,
        recuoLateral,
        setRecuoLateral,
        mapInstance,
        setMapInstance,
      }}
    >
      {children}
    </MapContext.Provider>
  );
}

export function useMap() {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
}
