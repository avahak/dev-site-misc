import { SidePairing } from './types';

export interface TilingData {
    p: number;
    q: number;
    sidePairings: SidePairing[];
}

export function serializeTiling(p: number, q: number, sidePairings: SidePairing[]): string {
    const data: TilingData = { p, q, sidePairings };
    return JSON.stringify(data, null, 2);
}

export function deserializeTiling(jsonString: string): TilingData {
    const parsed = JSON.parse(jsonString);
    if (typeof parsed.p !== 'number' || typeof parsed.q !== 'number' || !Array.isArray(parsed.sidePairings)) {
        throw new Error('Invalid tiling JSON structure');
    }
    return parsed as TilingData;
}

export async function copyTilingToClipboard(p: number, q: number, sidePairings: SidePairing[]): Promise<boolean> {
    try {
        const jsonStr = serializeTiling(p, q, sidePairings);
        await navigator.clipboard.writeText(jsonStr);
        return true;
    } catch (err) {
        console.error('Failed to copy tiling to clipboard:', err);
        return false;
    }
}