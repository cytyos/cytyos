import { create } from 'zustand';

// Types
export type BlockType = 'podium' | 'tower';
export type BlockUsage = 'residential' | 'corporate' | 'retail' | 'hotel' | 'parking' | 'amenities';

export interface Block {
  id: string;
  name: string;
  type: BlockType;
  usage: BlockUsage;
  height: number;
  baseArea: number;
  coordinates: any[]; 
  setback: number;
  color: string;
  isCustom: boolean;
}

export interface Land {
  area: number;
  cost: number;
  sellPrice: number;
  buildCost: number;
  maxFar: number;
  maxOccupancy: number;
  efficiency: number;
  geometry: any;
}

export interface Metrics {
  nsa: number;
  gfa: number;
  revenue: number;
  totalCost: number;
  grossProfit: number;
  margin: number;
  far: number;
  occupancy: number;
  isFarValid: boolean;
  isOccupancyValid: boolean;
}

interface ProjectState {
  blocks: Block[];
  land: Land;
  metrics: Metrics;
  currency: string;
  
  addBlock: (block: Omit<Block, 'id'>) => void;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  removeBlock: (id: string) => void;
  duplicateBlock: (id: string) => void;
  updateLand: (updates: Partial<Land>) => void;
  setCurrency: (currency: string) => void;
  loadProject: (data: any) => void;
  calculateMetrics: () => void;
}

// --- COLOR MAP BY USAGE (UPDATED: NEON CYBERPUNK PALETTE) ---
// This creates the "Cyan to Indigo" gradient look requested
const USAGE_COLORS: Record<BlockUsage, string> = {
  residential: '#06b6d4', // Cyan Neon (Main Residential)
  corporate:   '#6366f1', // Indigo Neon (Main Corporate)
  retail:      '#d946ef', // Fuchsia/Magenta (Vibrant Base)
  hotel:       '#8b5cf6', // Violet
  parking:     '#334155', // Dark Slate (Background)
  amenities:   '#10b981'  // Emerald (Tech Green)
};

// MIAMI DEFAULT SETTINGS (Brickell Area)
const INITIAL_LAND: Land = {
  area: 2000,
  cost: 5000000,
  sellPrice: 12000,
  buildCost: 4500,
  maxFar: 4.0,
  maxOccupancy: 70,
  efficiency: 0.85,
  // Initial Geometry set to Miami coordinates
  geometry: {
    type: 'Polygon',
    coordinates: [[
      [-80.1936, 25.7620], 
      [-80.1936, 25.7635], 
      [-80.1915, 25.7635], 
      [-80.1915, 25.7620], 
      [-80.1936, 25.7620]
    ]]
  }
};

const INITIAL_METRICS: Metrics = {
  nsa: 0, gfa: 0, revenue: 0, totalCost: 0, grossProfit: 0, margin: 0,
  far: 0, occupancy: 0, isFarValid: true, isOccupancyValid: true
};

export const useProjectStore = create<ProjectState>((set, get) => ({
  blocks: [],
  land: INITIAL_LAND,
  metrics: INITIAL_METRICS,
  currency: 'USD',

  setCurrency: (currency) => set({ currency }),

  addBlock: (blockData) => {
    const safeId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    
    // Automatically assign color based on usage from the new Neon Palette
    const assignedColor = USAGE_COLORS[blockData.usage] || '#06b6d4';

    const newBlock: Block = {
      ...blockData,
      id: safeId,
      color: assignedColor // Overwrite any color coming from map
    };
    
    set((state) => ({ blocks: [...state.blocks, newBlock] }));
    get().calculateMetrics();
  },

  updateBlock: (id, updates) => {
    set((state) => ({
      blocks: state.blocks.map((b) => {
        if (b.id !== id) return b;

        const updatedBlock = { ...b, ...updates };

        // If usage changed, update color automatically
        if (updates.usage) {
           updatedBlock.color = USAGE_COLORS[updates.usage] || b.color;
        }

        return updatedBlock;
      }),
    }));
    get().calculateMetrics();
  },

  removeBlock: (id) => {
    set((state) => ({
      blocks: state.blocks.filter((b) => b.id !== id),
    }));
    get().calculateMetrics();
  },

  duplicateBlock: (id) => {
    const block = get().blocks.find((b) => b.id === id);
    if (block) {
      get().addBlock({
        ...block,
        name: `${block.name} (Copy)`,
        coordinates: block.coordinates 
      });
    }
  },

  updateLand: (updates) => {
    set((state) => ({ land: { ...state.land, ...updates } }));
    get().calculateMetrics();
  },

  loadProject: (data) => {
    if (data.blocks && data.land) {
      const savedCurrency = (data as any).currency || 'USD';
      set({ blocks: data.blocks, land: data.land, currency: savedCurrency });
      get().calculateMetrics();
    }
  },

  calculateMetrics: () => {
    const { blocks, land } = get();
    let totalGfa = 0;
    let totalFootprint = 0;

    blocks.forEach((block) => {
      const area = block.baseArea || 0;
      const floors = Math.max(1, Math.floor((block.height || 3) / 3));
      totalGfa += area * floors;
      
      if (block.type === 'podium') {
         totalFootprint = Math.max(totalFootprint, area);
      } else if (totalFootprint === 0) {
         totalFootprint += area;
      }
    });

    const nsa = totalGfa * land.efficiency;
    const revenue = nsa * land.sellPrice;
    const totalCost = (totalGfa * land.buildCost) + land.cost;
    const grossProfit = revenue - totalCost;
    
    let margin = 0;
    if (revenue > 0) margin = (grossProfit / revenue) * 100;

    let far = 0;
    if (land.area > 0) far = totalGfa / land.area;

    let occupancy = 0;
    if (land.area > 0) occupancy = (totalFootprint / land.area) * 100;

    set({
      metrics: {
        nsa: Math.max(0, nsa),
        gfa: Math.max(0, totalGfa),
        revenue: Math.max(0, revenue),
        totalCost: Math.max(0, totalCost),
        grossProfit: grossProfit,
        margin: margin,
        far: Math.max(0, far),
        occupancy: Math.max(0, occupancy),
        isFarValid: far <= land.maxFar,
        isOccupancyValid: occupancy <= land.maxOccupancy
      }
    });
  }
}));