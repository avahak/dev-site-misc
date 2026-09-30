# AI-code to evaluate specific path rebuild events

import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import matplotlib.patheffects as path_effects

# =============================================================================
# Global Model Parameters
# =============================================================================
# S = 2.561553        # (1+sqrt(17))/2, x*(x-1) = 4, 2.5615528128088302749107049279870385125736
# THETA_VAL = np.pi/4
# NUM_LEVELS = 3
# TOTAL_LENGTH = 6.0  # Path length sufficient to trigger Level 2 rebuilds

S = 3.675
THETA_VAL = float(np.acos(((S-1)*S-6)/6))
NUM_LEVELS = 3
TOTAL_LENGTH = 15.0

RADII = [S**k for k in range(NUM_LEVELS)]

LEVEL_COLORS = ['blue', 'red', 'green']

# SAVE_FILE_PATHS = []
SAVE_FILE_PATHS = ['./notes/counter_example.png', '../../../public/counter_example.png']


# =============================================================================
# Geometry Helper Functions
# =============================================================================
def dist(a, b):
    """Euclidean distance between two 2D points."""
    return float(np.linalg.norm(np.array(a) - np.array(b)))

def polyline_length(vertices):
    """Total length of the polyline joining consecutive vertices."""
    diffs = np.diff(vertices, axis=0)
    return float(np.sum(np.hypot(diffs[:, 0], diffs[:, 1])))

def point_at_arc_length(vertices, s):
    """Evaluates exact point at arc length s along the polyline."""
    if s <= 0:
        return vertices[0].copy()
    
    total_len = polyline_length(vertices)
    if s >= total_len:
        return vertices[-1].copy()
    
    accumulated_s = 0.0
    for i in range(len(vertices) - 1):
        p1, p2 = vertices[i], vertices[i + 1]
        seg_len = dist(p1, p2)
        
        if accumulated_s + seg_len >= s:
            t = (s - accumulated_s) / seg_len
            return p1 + t * (p2 - p1)
        
        accumulated_s += seg_len
        
    return vertices[-1].copy()


# =============================================================================
# Exact Analytical Event Solver (Euclidean Distance Threshold Search)
# =============================================================================
def next_level0_rebuild(vertices, current_arc_length, current_center, radius):
    """
    Finds the smallest arc length s > current_arc_length such that
    |gamma(s) - current_center| == radius along a piecewise linear path.
    """
    accumulated_s = 0.0
    tol = 1e-9  # Numerical tolerance to prevent self-intersection at s
    
    for i in range(len(vertices) - 1):
        P = vertices[i]
        Q = vertices[i + 1]
        D = Q - P
        seg_len = float(np.linalg.norm(D))
        
        s_A = accumulated_s
        s_B = accumulated_s + seg_len
        accumulated_s = s_B
        
        if s_B <= current_arc_length + tol or seg_len == 0:
            continue
            
        U = P - current_center
        
        # Quadratic coefficients: A*lambda^2 + B*lambda + C = 0
        A = float(np.dot(D, D))
        B = 2.0 * float(np.dot(U, D))
        C = float(np.dot(U, U) - radius**2)
        
        discriminant = B**2 - 4.0 * A * C
        if discriminant < 0:
            continue
            
        sqrt_disc = np.sqrt(discriminant)
        roots_lambda = [(-B - sqrt_disc) / (2.0 * A), (-B + sqrt_disc) / (2.0 * A)]
        
        valid_candidates = []
        for lmbda in roots_lambda:
            if -1e-12 <= lmbda <= 1.0 + 1e-12:
                lmbda_clamped = float(np.clip(lmbda, 0.0, 1.0))
                candidate_s = s_A + lmbda_clamped * seg_len
                if candidate_s > current_arc_length + tol:
                    valid_candidates.append((candidate_s, P + lmbda_clamped * D))
        
        if valid_candidates:
            valid_candidates.sort(key=lambda item: item[0])
            return valid_candidates[0]
            
    return None, None


# =============================================================================
# Modular Path Generators
# =============================================================================
def geodesic_path(total_length):
    """Generates standard straight geodesic path along the x-axis."""
    return np.array([
        [0.0, 0.0],
        [total_length, 0.0]
    ])

def perturbed_path_custom(theta, total_length):
    """
    Generates a candidate perturbed path.
    - First perturbation.
    - Final segment: straight along x-axis to total_length
    """
    nodes = [[0.0, 0.0], 3*np.array([np.cos(theta), np.sin(theta)]), [6*np.cos(THETA_VAL), 0.0]]
        
    # Ensure path extends horizontally along the x-axis to total_length
    last_x = nodes[-1][0]
    if last_x < total_length:
        nodes.append(np.array([total_length, 0.0]))
        
    return np.array(nodes)


# =============================================================================
# Hierarchy & Simulation Engine
# =============================================================================
class Level:
    """Stores status and event history for a single hierarchy level."""
    def __init__(self, radius, initial_center, level_idx):
        self.radius = radius
        self.level_idx = level_idx
        self.center = np.array(initial_center, dtype=float)
        self.rebuild_positions = []
        self.rebuild_times = []


def simulate(vertices, radii):
    """
    Simulates hierarchical rebuild events strictly based on Euclidean distance thresholds.
    """
    num_levels = len(radii)
    start_pos = vertices[0]
    levels = [Level(radii[k], start_pos, k) for k in range(num_levels)]
    
    # Record initial position (t=0) for every level to represent initial rebuild state
    for lvl in levels:
        lvl.rebuild_positions.append(start_pos.copy())
        lvl.rebuild_times.append(0.0)
    
    current_arc_length = 0.0
    r0 = radii[0]
    highest_level_rebuilt = False
    
    while not highest_level_rebuilt:
        next_s, next_pos = next_level0_rebuild(vertices, current_arc_length, levels[0].center, r0)
        
        if next_s is None or next_pos is None:
            break 
            
        current_arc_length = next_s
        levels[0].center = next_pos.copy()
        levels[0].rebuild_positions.append(next_pos.copy())
        levels[0].rebuild_times.append(current_arc_length)
        
        # Propagation to higher levels
        for k in range(1, num_levels):
            d = dist(levels[k - 1].center, levels[k].center)
            threshold = radii[k] - radii[k - 1]
            
            if d > threshold:
                levels[k].center = levels[k - 1].center.copy()
                levels[k].rebuild_positions.append(levels[k].center.copy())
                levels[k].rebuild_times.append(current_arc_length)
                
                if k == num_levels - 1:
                    highest_level_rebuilt = True
            else:
                break
                
    return levels


# =============================================================================
# Mathematical Diagnostics
# =============================================================================
def analyze_and_print_diagnostics(name, vertices, levels, baseline_t_L2=None):
    """Computes and prints mathematical metrics for path comparison."""
    # Find rejoining point (first vertex on x-axis after kink where y==0)
    rejoin_idx = None
    accum_s = 0.0
    
    for i in range(1, len(vertices)):
        seg_len = dist(vertices[i - 1], vertices[i])
        accum_s += seg_len
        if i >= 2 and abs(vertices[i][1]) < 1e-12:
            rejoin_idx = i
            break
            
    if rejoin_idx is not None:
        x_rejoin = vertices[rejoin_idx][0]
        s_rejoin = accum_s
        extra_arc_length = s_rejoin - x_rejoin
        horizontal_offset = x_rejoin - s_rejoin  # Shift relative to arc length
    else:
        x_rejoin, s_rejoin, extra_arc_length, horizontal_offset = 0.0, 0.0, 0.0, 0.0

    # Index 0 is now t=0 initial state; index 1 is the first dynamic rebuild event
    t_L1 = levels[1].rebuild_times[1] if len(levels[1].rebuild_times) > 1 else None
    t_L2 = levels[2].rebuild_times[1] if len(levels[2].rebuild_times) > 1 else None

    print(f"\n==================================================")
    print(f" DIAGNOSTICS: {name}")
    print(f"==================================================")
    print(f" Rejoin x-coordinate           : {x_rejoin:.6f}")
    print(f" Rejoin arc length (s)         : {s_rejoin:.6f}")
    print(f" Total extra arc length        : {extra_arc_length:.6f}")
    print(f" Resulting horizontal offset   : {horizontal_offset:.6f}")
    print(f" First Level-1 rebuild time    : {t_L1:.6f}")
    print(f" First Level-2 rebuild time    : {t_L2:.6f}")
    
    if baseline_t_L2 and t_L2:
        time_saved = baseline_t_L2 - t_L2
        print(f" Level-2 time savings vs Geo   : {time_saved:+.6f}")
        if time_saved > 0:
            print(f" *** COUNTEREXAMPLE FOUND! Saved {time_saved:.6f} time units. ***")
            
    return t_L2


# =============================================================================
# Plotting Helpers
# =============================================================================
def plot_path(ax, vertices):
    """Draws path polyline in black."""
    ax.plot(vertices[:, 0], vertices[:, 1], color='black', linewidth=2, label='Path', zorder=1)

def plot_level(ax, level, color):
    """Draws rebuild centers, radii circles, and per-level index order (1-based)."""
    for idx, (pos, t) in enumerate(zip(level.rebuild_positions, level.rebuild_times)):
        x, y = pos
        alpha = 0.05 if level.level_idx < 2 else 0.0
        circle = patches.Circle((x, y), level.radius, color=color, alpha=alpha, fill=True, zorder=2)
        ax.add_patch(circle)
        border = patches.Circle((x, y), level.radius, edgecolor=color, alpha=0.8, fill=False, linestyle='--', zorder=2)
        ax.add_patch(border)
        ax.plot(x, y, marker='o', color=color, markersize=5, zorder=3)
        
        # ax.annotate(str(idx), (x, y), textcoords="offset points", xytext=(0, 5+12*level.level_idx), ha='center', fontsize=12, color=color, weight='bold', zorder=4)

        ann = ax.annotate(
            str(idx), (x, y), 
            textcoords="offset points", xytext=(0, 5 + 12 * level.level_idx), 
            ha='center', fontsize=12, color=color, weight='bold', zorder=100
        )
        # Adds a crisp white outline around text
        ann.set_path_effects([path_effects.withStroke(linewidth=2, foreground='white')])
        

def run_experiment(vertices, title, fig_num, baseline_t_L2=None, ax=None):
    """Runs simulation, outputs diagnostics, and produces visualization."""
    levels = simulate(vertices, RADII)
    print_chronological_rebuild_log(levels)
    t_L2 = analyze_and_print_diagnostics(title, vertices, levels, baseline_t_L2)

    # Create a new figure if no existing axis was passed
    if ax is None:
        return
        # fig, ax = plt.subplots(figsize=(10, 5))
    
    ax.set_title(title, fontsize=12, fontweight='bold')
    plot_path(ax, vertices)
    for k, lvl in enumerate(levels):
        plot_level(ax, lvl, LEVEL_COLORS[k])
        
    ax.set_aspect("equal")
    ax.grid(True, linestyle=':', alpha=0.6)
    # ax.set_xlabel("x")    # save space
    # ax.set_ylabel("y")
    return t_L2

# ---
# Printing out positions:
# ---

def print_chronological_rebuild_log(levels):
    """
    Prints all rebuild events across all levels in exact chronological order 
    of occurrence along the arc length parameter. 
    """
    events = []
    for k, lvl in enumerate(levels):
        for idx, (t, pos) in enumerate(zip(lvl.rebuild_times, lvl.rebuild_positions)):
            events.append((t, k, idx, pos))
            
    # Sort primarily by arc length s, secondarily by level k for simultaneous propagation
    events.sort(key=lambda e: (e[0], e[1]))
    
    print("\n================ CHRONOLOGICAL REBUILD LOG ================")
    print(f"{'Arc Length (s)':<16} | {'Level':<7} | {'Level Idx':<10} | {'Position (x, y)'}")
    print("-" * 60)
    for t, k, idx, pos in events:
        print(f"{t:<16.6f} | Level {k:<1} | #{idx:<9} | ({pos[0]:11.6f}, {pos[1]:11.6f})")

def save_image(fig, file_path: str):
    fig.savefig(file_path, transparent=False, dpi=100, bbox_inches='tight')
    print(f'Wrote image to file {file_path}.')

# =============================================================================
# Main Execution & Return Strategy Optimization Sweep
# =============================================================================
if __name__ == "__main__": 
    # Create a side-by-side figure layout (1 row, 2 columns)
    # fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5), layout="constrained")

    fig, ax = plt.subplots(figsize=(12, 5), layout="constrained")
    plt.xlim(-1.5, 14.5)
    plt.ylim(-4, 6.25)

    # 1. Baseline Geodesic Path
    geo_verts = geodesic_path(TOTAL_LENGTH)
    geo_t_L2 = run_experiment(geo_verts, "Geodesic baseline", fig_num=1, ax=None)
    
    # 2. Candidate Strategy A: Direct Vertical Drop (Previous naive path)
    # Return nodes: [(cos(theta), 0)]
    # path_vert = perturbed_path_custom(THETA_VAL, 2*np.cos(THETA_VAL)+3)
    path_vert = perturbed_path_custom(THETA_VAL, TOTAL_LENGTH)
    _ = run_experiment(path_vert, f"Rebuilds up to $t=15$", fig_num=2, baseline_t_L2=geo_t_L2, ax=ax)

    plt.show()

    for file_path in SAVE_FILE_PATHS:
        save_image(fig, file_path)
    