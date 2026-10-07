import React, { useEffect, useRef, useState } from 'react';
import { ShuffleRenderManager } from './shuffleManager';
import { EdgeClass, GroupElement, SidePairing } from './types';
import { Link as MUILink } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const App: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const managerRef = useRef<ShuffleRenderManager | null>(null);

    const [preset, setPreset] = useState<string>('6,4');
    const [maxRadius, setMaxRadius] = useState<number>(0.90);
    const [depthL, setDepthL] = useState<number>(3);
    const [autoSymmetrize, setAutoSymmetrize] = useState<boolean>(true);
    const [showTestSegment, setShowTestSegment] = useState<boolean>(true);

    const [pairings, setPairings] = useState<SidePairing[]>([]);
    const [generators, setGenerators] = useState<GroupElement[]>([]);
    const [exploredCount, setExploredCount] = useState<number>(0);
    const [stabilizerCount, setStabilizerCount] = useState<number>(0);
    const [edgeClasses, setEdgeClasses] = useState<EdgeClass[]>([]);

    useEffect(() => {
        if (!containerRef.current) return;

        const manager = new ShuffleRenderManager(containerRef.current);
        managerRef.current = manager;

        const controller = new AbortController();

        manager.onStateChange = (state) => {
            setGenerators(state.generators);
            setExploredCount(state.exploredCount);
            setStabilizerCount(state.stabilizerCount);
            setEdgeClasses(state.edgeClasses);
            setPairings([...manager.sidePairings]);
        };

        manager.init(controller.signal);

        return () => {
            controller.abort();
            manager.dispose();
            managerRef.current = null;
        };
    }, []);

    const pCount = parseInt(preset.split(',')[0], 10) || 6;

    const handlePresetChange = (newPreset: string) => {
        setPreset(newPreset);
        if (managerRef.current) {
            managerRef.current.setPreset(newPreset);
        }
    };

    const handlePairingTargetChange = (edgeIdx: number, newTarget: number) => {
        if (managerRef.current) {
            const currentSign = pairings[edgeIdx]?.sign || 1;
            managerRef.current.setPairing(edgeIdx, newTarget, currentSign);
        }
    };

    const handlePairingSignToggle = (edgeIdx: number) => {
        if (managerRef.current) {
            const currentPairing = pairings[edgeIdx];
            const newSign = currentPairing?.sign === 1 ? -1 : 1;
            const target = currentPairing?.targetEdgeIndex ?? edgeIdx;
            managerRef.current.setPairing(edgeIdx, target, newSign);
        }
    };

    return (
        <>
            <MUILink component={RouterLink} to="/" variant="body1" color="primary">
                Back
            </MUILink>
            <div style={{ display: 'flex', width: '100vw', height: '100vh', background: '#111', color: '#fff', fontFamily: 'sans-serif' }}>
                <div ref={containerRef} style={{ flex: 1, position: 'relative' }} />

                <div style={{ width: '380px', background: '#1a1a1a', borderLeft: '1px solid #333', padding: '16px', overflowY: 'auto' }}>
                    <h2>Side-Pairing Subgroup Tool</h2>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '6px' }}>Preset &#123;p,q&#125;:</label>
                        <select
                            value={preset}
                            onChange={(e) => handlePresetChange(e.target.value)}
                            style={{ width: '100%', padding: '8px', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px' }}
                        >
                            {['5,4', '5,5', '6,4', '6,6', '7,3', '8,3', '8,4', '10,3'].map(p => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={autoSymmetrize}
                                onChange={(e) => {
                                    setAutoSymmetrize(e.target.checked);
                                    if (managerRef.current) managerRef.current.setAutoSymmetrize(e.target.checked);
                                }}
                            />
                            Auto-Symmetrize Pairings (e_i ~ e_k =&gt; e_k ~ e_i)
                        </label>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={showTestSegment}
                                onChange={(e) => {
                                    setShowTestSegment(e.target.checked);
                                    if (managerRef.current) managerRef.current.setShowTestSegment(e.target.checked);
                                }}
                            />
                            Show Test Segment Orbits
                        </label>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '4px' }}>H Exploration Depth (L): {depthL}</label>
                        <input
                            type="range"
                            min={1}
                            max={8}
                            value={depthL}
                            onChange={(e) => {
                                const val = Number(e.target.value);
                                setDepthL(val);
                                if (managerRef.current) managerRef.current.setDepth(val);
                            }}
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '4px' }}>Max Tiling Radius: {maxRadius.toFixed(2)}</label>
                        <input
                            type="range"
                            min={0.70}
                            max={0.98}
                            step={0.01}
                            value={maxRadius}
                            onChange={(e) => {
                                const val = Number(e.target.value);
                                setMaxRadius(val);
                                if (managerRef.current) managerRef.current.setMaxRadius(val);
                            }}
                            style={{ width: '100%' }}
                        />
                    </div>

                    <hr style={{ borderColor: '#333', margin: '16px 0' }} />

                    <h3>Edge Pairings e_i &rarr; (s_i, e_k)</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {Array.from({ length: pCount }, (_, i) => {
                            const current = pairings[i] || { edgeIndex: i, targetEdgeIndex: i, sign: 1 };
                            return (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#222', padding: '6px 10px', borderRadius: '4px' }}>
                                    <span style={{ fontWeight: 'bold' }}>e_{i + 1} &sim;</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <button
                                            onClick={() => handlePairingSignToggle(i)}
                                            style={{
                                                padding: '4px 8px',
                                                background: current.sign === 1 ? '#2ecc71' : '#e74c3c',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '3px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {current.sign === 1 ? '+1 (Preserve)' : '-1 (Reverse)'}
                                        </button>
                                        <select
                                            value={current.targetEdgeIndex}
                                            onChange={(e) => handlePairingTargetChange(i, Number(e.target.value))}
                                            style={{ padding: '4px', background: '#333', color: '#fff', border: '1px solid #555', borderRadius: '3px' }}
                                        >
                                            {Array.from({ length: pCount }, (_, k) => (
                                                <option key={k} value={k}>e_{k + 1}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <hr style={{ borderColor: '#333', margin: '16px 0' }} />

                    <h3>Computed Generators h_i</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontFamily: 'monospace' }}>
                        {generators.map((g, idx) => (
                            <div key={idx} style={{ background: '#222', padding: '6px', borderRadius: '4px' }}>
                                <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>h_{idx + 1}:</span> {g.word.canonicalString}
                            </div>
                        ))}
                    </div>

                    <hr style={{ borderColor: '#333', margin: '16px 0' }} />

                    <h3>Orbit &amp; Stabilizer Info</h3>
                    <p>Explored |H| elements: <strong>{exploredCount}</strong></p>
                    <p>Base Polygon Stabilizer |H &cap; Stab(P)|: <strong>{stabilizerCount}</strong></p>
                    <p>Edge Equivalences: <strong>{edgeClasses.length} class(es)</strong></p>
                </div>
            </div>
        </>
    );
};

export default App;