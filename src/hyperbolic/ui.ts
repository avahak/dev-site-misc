import { GroupElement, SubgroupState } from './types';
import { TriangleGroup } from './groupAlgebra';
import { RenderManager } from './manager';
import { ComplexMath, MobiusTransform } from './hyperbolic';

export class AppController {
    renderManager: RenderManager;
    triangleGroup: TriangleGroup;
    subgroupState: SubgroupState;
    deltaK: GroupElement[] = [];
    overlayEl: HTMLDivElement | null = null;

    generatorListEl!: HTMLElement;
    wordListEl!: HTMLElement;
    edgeClassEl!: HTMLElement;
    stabilizerEl!: HTMLElement;
    statsEl!: HTMLElement;

    constructor(container: HTMLDivElement) {
        this.renderManager = new RenderManager(container);
        this.triangleGroup = new TriangleGroup(6, 4);

        this.subgroupState = {
            generators: [],
            explorationDepth: 3,
            exploredElements: [],
            stabilizerElements: [],
            edgeClasses: []
        };
    }

    async start(abortSignal?: AbortSignal) {
        const controller = new AbortController();
        const signal = abortSignal || controller.signal;

        await this.renderManager.init(signal);

        if (signal.aborted) {
            this.dispose();
            return;
        }

        this.buildUIOverlay();
        this.bindEvents();

        this.deltaK = this.triangleGroup.generateDeltaK(this.renderManager.params.maxRadius);
        this.renderManager.updateDeltaK(this.deltaK, this.subgroupState.generators);

        this.recomputeSubgroup();
    }

    dispose() {
        if (this.overlayEl && this.overlayEl.parentElement) {
            this.overlayEl.parentElement.removeChild(this.overlayEl);
            this.overlayEl = null;
        }
        this.renderManager.dispose();
    }

    private buildUIOverlay() {
        const root = document.createElement('div');
        root.className = 'app-overlay';
        root.innerHTML = `
            <style>
                .app-overlay {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    pointer-events: none; display: flex; justify-content: space-between;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
                    color: #eaeaea; box-sizing: border-box; padding: 12px; gap: 12px;
                }
                .panel {
                    width: 280px; height: calc(100% - 24px); max-height: 100%;
                    background: rgba(20, 20, 28, 0.88); backdrop-filter: blur(8px);
                    border: 1px solid #333; border-radius: 8px; padding: 12px;
                    pointer-events: auto; display: flex; flex-direction: column; gap: 8px;
                    box-sizing: border-box; box-shadow: 0 8px 32px rgba(0,0,0,0.4);
                }
                .panel h3 { margin: 0; font-size: 15px; color: #fff; border-bottom: 1px solid #333; padding-bottom: 6px; }
                .panel h4 { margin: 6px 0 2px 0; font-size: 12px; color: #aaa; text-transform: uppercase; letter-spacing: 0.5px; }
                
                .scroll-area {
                    flex: 1; min-height: 60px; overflow-y: auto;
                    border: 1px solid #2a2a35; border-radius: 4px; padding: 6px;
                    background: rgba(10, 10, 15, 0.5);
                }
                .scroll-area::-webkit-scrollbar { width: 6px; }
                .scroll-area::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
                .scroll-area::-webkit-scrollbar-thumb { background: #444; border-radius: 3px; }
                .scroll-area::-webkit-scrollbar-thumb:hover { background: #666; }

                .word-item {
                    cursor: pointer; padding: 4px 6px; margin: 2px 0; border-radius: 4px;
                    font-size: 12px; font-family: monospace; transition: all 0.15s;
                    display: flex; justify-content: space-between; align-items: center;
                }
                .word-item:hover { background: #2c3e50; }
                .word-item.generator { background: #27ae60; font-weight: bold; color: #fff; }
                .word-item.explored { background: rgba(41, 128, 185, 0.25); border-left: 3px solid #5dade2; color: #aed6f1; }
                .word-dist { font-size: 10px; color: #888; margin-left: 6px; }

                .gen-item {
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 3px 6px; margin: 2px 0; background: rgba(39, 174, 96, 0.2);
                    border: 1px solid #27ae60; border-radius: 4px; font-size: 12px;
                }
                .remove-gen-btn {
                    background: none; border: none; color: #e74c3c; cursor: pointer;
                    font-weight: bold; font-size: 14px; padding: 0 4px; border-radius: 3px;
                }
                .remove-gen-btn:hover { background: rgba(231, 76, 60, 0.3); }

                .btn {
                    background: #e74c3c; color: white; border: none; padding: 6px 12px;
                    border-radius: 4px; cursor: pointer; font-weight: 600; font-size: 12px;
                    transition: background 0.2s; text-align: center; margin-top: 4px;
                }
                .btn:hover { background: #c0392b; }

                .edge-badge {
                    display: inline-block; padding: 2px 6px; margin: 2px;
                    border-radius: 3px; color: #fff; font-weight: bold; font-size: 11px;
                }
                .edge-class-row {
                    margin-bottom: 6px; padding: 4px 6px; background: rgba(255,255,255,0.03);
                    border-radius: 4px; border: 1px solid rgba(255,255,255,0.05);
                }
            </style>
            
            <!-- Left Panel -->
            <div class="panel">
                <h3>Subgroup H</h3>
                <div>H = &langle; <span id="gen-text">1</span> &rangle;</div>
                <button id="reset-btn" class="btn">Reset H</button>
                
                <h4>Generators</h4>
                <div id="generator-list">None</div>

                <h4>&Delta;<sub>k</sub> Word Window</h4>
                <div class="scroll-area" id="word-list"></div>
            </div>

            <!-- Right Panel -->
            <div class="panel">
                <h3>Edge Partition & Stats</h3>
                <div id="stats-info"></div>

                <h4>Polygon Stabilizer H<sub>P</sub></h4>
                <div id="stabilizer-info">None</div>

                <h4>Oriented Edge Classes</h4>
                <div class="scroll-area" id="edge-classes"></div>
            </div>
        `;

        this.overlayEl = root;
        this.renderManager.container.appendChild(root);

        this.generatorListEl = root.querySelector('#generator-list')!;
        this.wordListEl = root.querySelector('#word-list')!;
        this.edgeClassEl = root.querySelector('#edge-classes')!;
        this.stabilizerEl = root.querySelector('#stabilizer-info')!;
        this.statsEl = root.querySelector('#stats-info')!;

        root.querySelector('#reset-btn')!.addEventListener('click', () => {
            this.subgroupState.generators = [];
            this.recomputeSubgroup();
        });
    }

    private bindEvents() {
        this.renderManager.onParamsChange = (params) => {
            const [p, q] = params.preset.split(',').map(Number);
            if (this.triangleGroup.p !== p || this.triangleGroup.q !== q) {
                this.triangleGroup = new TriangleGroup(p, q);
                this.subgroupState.generators = [];
            }
            this.subgroupState.explorationDepth = params.depthL;
            this.deltaK = this.triangleGroup.generateDeltaK(params.maxRadius);
            this.renderManager.updateDeltaK(this.deltaK, this.subgroupState.generators);
            this.recomputeSubgroup();
        };

        this.renderManager.onElementHover = (el) => {
            const items = this.wordListEl.querySelectorAll('.word-item');
            items.forEach(item => {
                if (el && item.getAttribute('data-id') === el.id) {
                    (item as HTMLElement).style.outline = '1px solid #f1c40f';
                } else {
                    (item as HTMLElement).style.outline = 'none';
                }
            });
        };

        this.renderManager.onElementSelect = (el) => {
            this.toggleGenerator(el);
        };
    }

    private toggleGenerator(el: GroupElement) {
        const idx = this.subgroupState.generators.findIndex(g => g.id === el.id);
        if (idx >= 0) {
            this.subgroupState.generators.splice(idx, 1);
        } else {
            this.subgroupState.generators.push(el);
        }
        this.recomputeSubgroup();
    }

    private recomputeSubgroup() {
        const { generators, explorationDepth } = this.subgroupState;

        this.subgroupState.exploredElements = this.triangleGroup.exploreSubgroup(generators, explorationDepth);
        this.subgroupState.stabilizerElements = this.triangleGroup.findBasePolygonStabilizer(this.subgroupState.exploredElements);
        this.subgroupState.edgeClasses = this.triangleGroup.computeEdgeClasses(
            this.triangleGroup.p,
            this.subgroupState.stabilizerElements
        );

        this.renderManager.updateDeltaK(this.deltaK, this.subgroupState.generators);
        this.renderManager.updateExploredOrbit(
            this.subgroupState.exploredElements,
            this.subgroupState.edgeClasses
        );

        this.updateUI();
    }

    private updateUI() {
        if (!this.overlayEl) return;

        const genNames = this.subgroupState.generators.map(g => g.word.canonicalString);
        (document.querySelector('#gen-text') as HTMLElement).innerText = genNames.length > 0 ? genNames.join(', ') : '1';

        this.generatorListEl.innerHTML = this.subgroupState.generators.map((g, idx) => `
            <div class="gen-item">
                <span>h<sub>${idx + 1}</sub> = <b>${g.word.canonicalString}</b></span>
                <button class="remove-gen-btn" data-id="${g.id}">&times;</button>
            </div>
        `).join('') || '<div style="color:#777;">None</div>';

        this.generatorListEl.querySelectorAll('.remove-gen-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
                const found = this.subgroupState.generators.find(g => g.id === id);
                if (found) this.toggleGenerator(found);
            });
        });

        this.wordListEl.innerHTML = this.deltaK.map(el => {
            const isGen = this.subgroupState.generators.some(g => g.id === el.id);
            const inExplored = !isGen && this.subgroupState.exploredElements.some(
                e => MobiusTransform.distance(e.matrix, el.matrix) < 1e-4
            );

            let itemClass = 'word-item';
            if (isGen) itemClass += ' generator';
            else if (inExplored) itemClass += ' explored';

            const rVal = ComplexMath.abs(MobiusTransform.apply(el.matrix, { re: 0, im: 0 })).toFixed(2);

            return `
                <div class="${itemClass}" data-id="${el.id}">
                    <span>${el.word.canonicalString}</span>
                    <span class="word-dist">r=${rVal}</span>
                </div>
            `;
        }).join('');

        this.wordListEl.querySelectorAll('.word-item').forEach(el => {
            el.addEventListener('mouseenter', () => {
                const id = el.getAttribute('data-id');
                const found = this.deltaK.find(g => g.id === id);
                if (found) this.renderManager.highlightElement(found);
            });
            el.addEventListener('mouseleave', () => {
                this.renderManager.highlightElement(null);
            });
            el.addEventListener('click', () => {
                const id = el.getAttribute('data-id');
                const found = this.deltaK.find(g => g.id === id);
                if (found) this.toggleGenerator(found);
            });
        });

        this.stabilizerEl.innerHTML = `
            <div>Size: <b>${this.subgroupState.stabilizerElements.length}</b></div>
            <div>Elements: ${this.subgroupState.stabilizerElements.map(s => s.word.canonicalString).join(', ')}</div>
        `;

        this.edgeClassEl.innerHTML = this.subgroupState.edgeClasses.map(cls => `
            <div class="edge-class-row">
                <b>${cls.id}:</b>
                ${cls.edgeIndices.map(i => `<span class="edge-badge" style="background:${cls.color}">e<sub>${i}</sub></span>`).join('')}
            </div>
        `).join('');

        this.statsEl.innerHTML = `
            <div>Explored subgroup elements: <b>${this.subgroupState.exploredElements.length}</b></div>
            <div>Edge equivalence classes: <b>${this.subgroupState.edgeClasses.length}</b></div>
        `;
    }
}