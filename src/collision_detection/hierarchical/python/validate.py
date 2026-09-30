"""
Contains AI-code. Finding possible counter-example trees. Probably deprecated!

Example found: T_5 = 4(2G_3+((5G_1)+2G_2)).
Or T_2=5G_1, T_3=2G_2+T_2, T_4=2G_3+T_3, T_5=4T_4.

--- [Level 0]  (Threshold = 0.0000) ---
  G_0     | a=1.0000     N=1     L=1     R=1.00000000
          └─ Composition: Leaf

--- [Level 1]  (Threshold = 2.6750    ) ---
  G_1     | a=3.0000     N=4     L=3     R=1.33333333
          └─ Composition: 3x G_0

--- [Level 2]  (Threshold = 9.8306    ) ---
  G_2     | a=12.0000    N=17    L=12    R=1.41666667
          └─ Composition: 4x G_1
  T_2_1   | a=13.5056    N=21    L=15    R=1.40000000
          └─ Composition: 5x G_1

--- [Level 3]  (Threshold = 36.1275   ) ---
  G_3     | a=48.0000    N=69    L=48    R=1.43750000
          └─ Composition: 4x G_2
  T_3_1   | a=37.5056    N=56    L=39    R=1.43589744
          └─ Composition: 1x T_2_1 + 2x G_2

--- [Level 4]  (Threshold = 132.7687  ) ---
  G_4     | a=144.0000   N=208   L=144   R=1.44444444 (unused in candidate)
          └─ Composition: 3x G_3
  T_4_1   | a=133.5056   N=195   L=135   R=1.44444444
          └─ Composition: 2x G_3 + 1x T_3_1

--- [Level 5]  (Threshold = 487.9251  ) ---
  G_5     | a=576.0000   N=833   L=576   R=1.44618056 (unused in candidate)
          └─ Composition: 4x G_4
  T_5_1   | a=534.0225   N=781   L=540   R=1.44629630
          └─ Composition: 4x T_4_1
"""

import math
import random
import itertools
from dataclasses import dataclass, field
from typing import List, Dict, Tuple
from collections import Counter
import builtins

# def print(*args, **kwargs):
#     pass    # no output to slow down

@dataclass(frozen=True)
class TreeNodeState:
    """Minimal state tuple representing a hierarchical subtree candidate."""
    a: float                                # advance
    N: int                                  # Total node count in subtree
    L: int                                  # Leaf count (level-0 nodes)
    y_low: float                            # Objective evaluation at R_low: N - R_low * L
    y_high: float                           # Objective evaluation at R_high: N - R_high * L
    level: int = 0                          # Level of the root node
    children: Tuple['TreeNodeState', ...] = field(default_factory=tuple)

    def ratio(self) -> float:
        """Returns the objective ratio R(I) = N(I) / L(I)."""
        return self.N / self.L if self.L > 0 else 0.0


def print_tree_structure(node: TreeNodeState, indent: int = 0) -> None:
    """Prints a concise, grouped breakdown of a tree state's children."""
    prefix = "  " * indent
    if node.level == 0 or not node.children:
        print(f"{prefix}Leaf (level 0) [a=1.0, N=1, L=1]")
        return

    print(
        f"{prefix}Level {node.level} Node [a={node.a:.4f}, N={node.N}, L={node.L}, R={node.ratio():.8f}] "
        f"with {len(node.children)} children:"
    )

    child_counts: Dict[Tuple[float, int, int], Tuple[TreeNodeState, int]] = {}
    for child in node.children:
        key = (round(child.a, 8), child.N, child.L)
        if key in child_counts:
            ref, count = child_counts[key]
            child_counts[key] = (ref, count + 1)
        else:
            child_counts[key] = (child, 1)

    for (c_a, c_N, c_L), (child_ref, count) in child_counts.items():
        print(f"{prefix}  --> {count}x child copy with (a={c_a}, N={c_N}, L={c_L}, R={child_ref.ratio():.8f}):")
        print_tree_structure(child_ref, indent + 2)


def verify_tree_from_scratch(node: TreeNodeState, S: float) -> Tuple[bool, float, int, int]:
    """Independently verifies admissibility, advances, and counts bottom-up from leaves."""
    if node.level == 0 or not node.children:
        return True, 1.0, 1, 1

    child_results = [verify_tree_from_scratch(c, S) for c in node.children]

    for is_adm, _, _, _ in child_results:
        if not is_adm:
            return False, 0.0, 0, 0

    A_raw = sum(a for _, a, _, _ in child_results)
    # A_max = max(a for _, a, _, _ in child_results)
    threshold = (S - 1.0) * (S ** (node.level - 1))
    upper_limit = S ** node.level

    if A_raw + 1e-12 <= threshold:
        return False, 0.0, 0, 0

    a_eff = min(A_raw, upper_limit)
    N_eff = 1 + sum(N for _, _, N, _ in child_results)
    L_eff = sum(L for _, _, _, L in child_results)

    return True, a_eff, N_eff, L_eff


class GeodesicTree:
    """Computes and stores properties of Geodesic Trees G_k(S) up to height K_max."""
    def __init__(self, S: float, K_max: int):
        self.S = S
        self.n = math.floor(S)
        self.K_max = K_max

        self.nodes: List[TreeNodeState] = []
        self.R: List[float] = []

        leaf = TreeNodeState(a=1.0, N=1, L=1, y_low=0.0, y_high=0.0, level=0)
        self.nodes.append(leaf)
        self.R.append(1.0)

        self._build_tree()

    def _build_tree(self) -> None:
        """Constructs G_k(S) bottom-up by finding minimal branching factor m_k."""
        for k in range(1, self.K_max + 1):
            prev_node = self.nodes[k - 1]
            threshold = (self.S - 1.0) * (self.S ** (k - 1))

            # Minimal integer m_k such that m_k * a_{k-1} > (S - 1) * S^{k-1}
            m_k = math.floor(threshold / prev_node.a) + 1

            L_k = m_k * prev_node.L
            N_k_total = 1 + m_k * prev_node.N
            children = (prev_node,) * m_k

            curr_node = TreeNodeState(
                a=L_k, N=N_k_total, L=L_k,
                y_low=0.0, y_high=0.0,
                level=k, children=children
            )
            self.nodes.append(curr_node)
            self.R.append(N_k_total / L_k)


class UpperBoundCalculator:
    """Computes upper bound R_high for target height K using proven lower-level bounds."""
    @staticmethod
    def compute_u_j(S: float, j: int) -> float:
        n = math.floor(S)
        term1 = 1.0 / math.floor((S - 1.0) * (S ** (j - 1)) + 1.0)
        term2 = 1.0 / (n ** j)
        return min(term1, term2)

    @classmethod
    def compute_R_high(cls, S: float, target_K: int, r_proven: Dict[int, float]) -> float:
        return r_proven[target_K - 1] + cls.compute_u_j(S, target_K)


class CandidatePruner:
    """Prunes candidate subtrees via 3D Pareto dominance on (a, y_low, y_high)."""
    @staticmethod
    def prune(candidates: List[TreeNodeState]) -> List[TreeNodeState]:
        sorted_cand = sorted(
            candidates,
            key=lambda c: (c.a, c.y_low, c.y_high),
            reverse=True
        )

        non_dominated: List[TreeNodeState] = []
        for cand in sorted_cand:
            is_dominated = False
            for kept in non_dominated:
                if kept.y_low >= cand.y_low - 1e-12 and kept.y_high >= cand.y_high - 1e-12:
                    is_dominated = True
                    break
            if not is_dominated:
                non_dominated.append(cand)

        return non_dominated


def check_infinite_counterexample(
    cand: TreeNodeState,
    geodesics: GeodesicTree,
    S: float,
    eps: float = 1e-15,
    max_iter: int = 200
) -> bool:
    """Extends candidate T and geodesic state G infinitely."""
    K0 = cand.level
    print("\n" + "=" * 60)
    print(f"INFINITE-LEVEL EXTENSION ANALYSIS (Base K0 = {K0})")
    print("=" * 60)

    # 1. Candidate Infinite Extension
    a_cand = float(cand.a)
    L_cand = cand.L
    R_cand_limit = cand.ratio()

    print(f"Candidate base state T at level {K0}:")
    print(f"  a(T) = {a_cand:.4f}, N(T) = {cand.N}, L(T) = {L_cand}")
    print(f"  Base ratio R_{K0}(T) = {R_cand_limit:.12f}")

    k = K0 + 1
    total_tail_cand = 0.0
    cand_steps = 0

    while True:
        threshold = (S - 1.0) * (S ** (k - 1))
        m_k = math.floor(threshold / a_cand) + 1

        a_cand = a_cand * m_k
        L_cand *= m_k

        term = 1.0 / L_cand
        R_cand_limit += term
        total_tail_cand += term
        cand_steps += 1

        if term < eps or cand_steps >= max_iter:
            break
        k += 1

    print(f"  Tail sum added over {cand_steps} levels: +{total_tail_cand:.12e}")
    print(f"  --> Infinite Limit R(T*) = {R_cand_limit:.12f}")

    # 2. Canonical Geodesic Infinite Extension
    g0 = geodesics.nodes[K0]
    a_geo = float(g0.a)
    L_geo = g0.L
    R_geo_limit = geodesics.R[K0]

    k = K0 + 1
    total_tail_geo = 0.0
    geo_steps = 0

    while True:
        threshold = (S - 1.0) * (S ** (k - 1))
        m_k = math.floor(threshold / a_geo) + 1

        a_geo = a_geo * m_k
        L_geo *= m_k

        term = 1.0 / L_geo
        R_geo_limit += term
        total_tail_geo += term
        geo_steps += 1

        if term < eps or geo_steps >= max_iter:
            break
        k += 1

    print(f"\nCanonical Geodesic state G_{K0}:")
    print(f"  Base ratio R_{K0}(G) = {geodesics.R[K0]:.12f}")
    print(f"  Tail sum added over {geo_steps} levels: +{total_tail_geo:.12e}")
    print(f"  --> Infinite Limit R(G_inf) = {R_geo_limit:.12f}")

    # 3. Limit Comparison
    diff = R_cand_limit - R_geo_limit
    print("-" * 60)
    print(f"Limit Advantage [R(T*) - R(G_inf)]: {diff:+.12e}")

    if diff > 1e-12:
        print("[VERIFIED] T* remains a valid counter-example for K = infinity!")
        print("=" * 60 + "\n")
        return True
    else:
        print("[OVERRIDDEN] The finite advantage was absorbed in the tail. Fails at K = infinity.")
        print("=" * 60 + "\n")
        return False


def print_symbolic_manifest(root: TreeNodeState, geodesics: GeodesicTree, S: float) -> bool:
    """Prints bottom-up building block manifest including G_k and T_k_j with level bounds."""
    node_to_label: Dict[Tuple, str] = {}
    manifest: Dict[int, Dict[str, dict]] = {}

    geo_keys = {
        (g_node.level, round(g_node.a, 8), g_node.N, g_node.L): f"G_{k}"
        for k, g_node in enumerate(geodesics.nodes)
    }

    def get_node_key(node: TreeNodeState) -> Tuple:
        if not node.children:
            return (0, 1.0, 1, 1)
        child_keys = tuple(sorted(get_node_key(c) for c in node.children))
        return (node.level, round(node.a, 8), node.N, node.L, child_keys)

    uses_early_non_g = { "uses": False }

    def catalog(node: TreeNodeState) -> str:
        key = get_node_key(node)
        if key in node_to_label:
            return node_to_label[key]

        level = node.level
        if level not in manifest:
            manifest[level] = {}

        simple_key = (level, round(node.a, 8), node.N, node.L)
        if simple_key in geo_keys:
            label = geo_keys[simple_key]
        else:
            if level < 2:
                uses_early_non_g["uses"] = True
            custom_count = sum(1 for lbl in manifest[level] if lbl.startswith("T_")) + 1
            label = f"T_{level}_{custom_count}"

        node_to_label[key] = label

        child_labels = [catalog(c) for c in node.children]
        composition_counts = Counter(child_labels)
        formula_parts = [f"{count}x {c_label}" for c_label, count in composition_counts.items()]
        formula = " + ".join(formula_parts) if formula_parts else "Leaf"

        manifest[level][label] = {
            "label": label,
            "a": node.a,
            "N": node.N,
            "L": node.L,
            "R": node.ratio(),
            "formula": formula,
            "used": True,
        }
        return label

    catalog(root)

    max_level = max(manifest.keys())
    for k in range(max_level + 1):
        if k not in manifest:
            manifest[k] = {}

        g_label = f"G_{k}"
        if g_label not in manifest[k] and k < len(geodesics.nodes):
            g_node = geodesics.nodes[k]
            g_formula = "Leaf" if k == 0 else f"{len(g_node.children)}x G_{k-1}"
            manifest[k][g_label] = {
                "label": g_label,
                "a": g_node.a,
                "N": g_node.N,
                "L": g_node.L,
                "R": g_node.ratio(),
                "formula": g_formula,
                "used": False,
            }

    print("\n==========================================================================")
    print("                     SYMBOLIC BUILDING BLOCK MANIFEST                     ")
    print("==========================================================================")

    for level in range(max_level + 1):
        if level == 0:
            bounds_str = "Threshold = 0.0000"
        else:
            thresh = (S - 1.0) * (S ** (level - 1))
            bounds_str = f"Threshold = {thresh:<10.4f}"

        print(f"\n--- [Level {level}]  ({bounds_str}) ---")

        sorted_labels = sorted(
            manifest[level].keys(),
            key=lambda lbl: (0 if lbl.startswith("G_") else 1, lbl)
        )

        for lbl in sorted_labels:
            item = manifest[level][lbl]
            used_tag = "" if item["used"] else " (unused in candidate)"
            print(f"  {item['label']:<7} | a={item['a']:<10.4f} N={item['N']:<5} L={item['L']:<5} R={item['R']:.8f}{used_tag}")
            print(f"          └─ Composition: {item['formula']}")

    print("==========================================================================\n")
    return uses_early_non_g["uses"]


class HierarchicalVerifier:
    """Executes step-by-step inductive verification of the global domination conjecture."""
    def __init__(self, S: float):
        if S <= 1.0:
            raise ValueError("S must be strictly greater than 1.")
        self.S = S
        self.n = math.floor(S)
        self.r_proven: Dict[int, float] = {}

    def verify_up_to(self, max_K: int) -> bool:
        print("==================================================")
        print(f"Starting Inductive Verification for S = {self.S}")
        print(f"Base parameter n = floor(S) = {self.n}")
        print(f"Target max height K = {max_K}")
        print("==================================================\n")

        geodesics = GeodesicTree(self.S, max_K)

        for K_target in range(1, max_K + 1):
            success = self._verify_height(self.S, K_target, geodesics)
            if not success:
                print(f"\n[FAILURE] Potential counterexample detected at height K = {K_target}!")
                return False

            self.r_proven[K_target] = geodesics.R[K_target]
            print(f"[SUCCESS] Height K = {K_target} verified! Proven r_{K_target} = {self.r_proven[K_target]:.8f}\n")

        print("==================================================")
        print(f"ALL HEIGHTS 1 TO {max_K} NUMERICALLY VERIFIED!")
        print("==================================================")
        return True

    def _verify_height(self, S: float, target_K: int, geodesics: GeodesicTree) -> bool:
        R_low = geodesics.R[target_K]
        R_high = R_low if target_K == 1 else UpperBoundCalculator.compute_R_high(self.S, target_K, self.r_proven)

        print(f"--- Target Height K = {target_K} ---")
        print(f"Static Bounds: R_low = {R_low:.8f}, R_high = {R_high:.8f} (Interval: {R_high - R_low:.8f})")

        P_prev: List[TreeNodeState] = []
        leaf = geodesics.nodes[0]

        for k in range(1, target_K + 1):
            threshold = (self.S - 1.0) * (self.S ** (k - 1))

            if k == 1:
                level_1_states = []
                for m in range(self.n, self.n + 3):
                    a_raw = float(m)
                    if a_raw > threshold + 1e-12 and a_raw < threshold + 2.0 - 1e-12:
                        a_eff = a_raw
                        N_eff = m + 1
                        L_eff = m
                        level_1_states.append(TreeNodeState(
                            a=a_eff, N=N_eff, L=L_eff,
                            y_low=N_eff - R_low * L_eff,
                            y_high=N_eff - R_high * L_eff,
                            level=1, children=(leaf,) * m
                        ))
                P_prev = CandidatePruner.prune(level_1_states)
                print(f"  Level 1: {len(P_prev)} state(s) initialized")
                continue

            # Construct Saturated Anchor node using m_sat copies of G_{k-1}
            g_prev_node = geodesics.nodes[k - 1]
            m_sat = 1 + math.ceil((self.S ** k) / g_prev_node.a)
            anchor_N = 1 + m_sat * g_prev_node.N
            anchor_L = m_sat * g_prev_node.L
            anchor = TreeNodeState(
                a=self.S ** k, N=anchor_N, L=anchor_L,
                y_low=anchor_N - R_low * anchor_L,
                y_high=anchor_N - R_high * anchor_L,
                level=k, children=(g_prev_node,) * m_sat
            )

            raw_candidates: List[TreeNodeState] = []
            total_combos = 0
            filtered_admissibility = 0
            filtered_anchor = 0

            upper = self.n + 3 if k < target_K else self.n + 1
            for m in range(self.n, upper+1):
                for combo in itertools.combinations_with_replacement(P_prev, m):
                    total_combos += 1
                    A_raw = sum(c.a for c in combo)
                    # A_max = max(c.a for c in combo)
                    upper_limit = S**k

                    if A_raw <= threshold + 1e-12:
                        filtered_admissibility += 1
                        continue

                    a_eff = min(A_raw, upper_limit)
                    N_eff = 1 + sum(c.N for c in combo)
                    L_eff = sum(c.L for c in combo)

                    y_low = N_eff - R_low * L_eff
                    y_high = N_eff - R_high * L_eff

                    if y_low <= anchor.y_low + 1e-12 and y_high <= anchor.y_high + 1e-12:
                        if not (a_eff == anchor.a and N_eff == anchor.N and L_eff == anchor.L):
                            filtered_anchor += 1
                            continue

                    raw_candidates.append(TreeNodeState(
                        a=a_eff, N=N_eff, L=L_eff,
                        y_low=y_low, y_high=y_high,
                        level=k, children=combo
                    ))

            unique_dict: Dict[Tuple[float, int, int], TreeNodeState] = {}
            for c in raw_candidates:
                key = (round(c.a, 10), c.N, c.L)
                if key not in unique_dict:
                    unique_dict[key] = c

            unique_candidates = list(unique_dict.values())
            P_prev = CandidatePruner.prune(unique_candidates)

            print(f"  Level {k}: Combos tested={total_combos} | Inadmissible={filtered_admissibility} | "
                  f"Anchor-dropped={filtered_anchor} | Unique={len(unique_candidates)} -> Pruned={len(P_prev)}")

        max_y_low_cand = max(P_prev, key=lambda c: c.y_low)

        if max_y_low_cand.y_low > 1e-10:
            print("\n==================================================")
            print(f"[DISCOVERY] Potential counterexample at Height K = {target_K}!")
            print(f"Geodesic Tree G_{target_K} Ratio: {R_low:.8f}")
            print(f"Candidate Tree Ratio       : {max_y_low_cand.ratio():.8f}")
            print(f"y_low Advantage            : {max_y_low_cand.y_low:.10f}")
            print("==================================================")

            print("\n--- Structural Breakdown of Candidate Tree ---")
            print_tree_structure(max_y_low_cand)
            uses_early_non_g = print_symbolic_manifest(max_y_low_cand, geodesics, S)

            print("\n--- Independent Ground-Truth Verification ---")
            is_valid, calc_a, calc_N, calc_L = verify_tree_from_scratch(max_y_low_cand, self.S)
            calc_R = calc_N / calc_L if calc_L > 0 else 0.0

            print(f"Admissible          : {is_valid}")
            print(f"Recalculated Advance: {calc_a:.6f} (Expected: {max_y_low_cand.a:.6f})")
            print(f"Recalculated Nodes  : {calc_N} (Expected: {max_y_low_cand.N})")
            print(f"Recalculated Leaves : {calc_L} (Expected: {max_y_low_cand.L})")
            print(f"Recalculated Ratio  : {calc_R:.8f}")

            if is_valid:
                check_infinite_counterexample(max_y_low_cand, geodesics, self.S)

            # if uses_early_non_g:
            return False

        return True


def find():
    # for S in [random.uniform(1.25, 3.67) for _ in range(1_000_000)]:
    for S in [random.uniform(2.1, 3.9) for _ in range(10_000_000)]:
        print(f"{S = }")
        verifier = HierarchicalVerifier(S)
        verified = verifier.verify_up_to(max_K=6)
        # builtins.print(".", end='', flush=True)
        if not verified:
            builtins.print(f"Counter-example found for {S = }")
            exit()


def verify(S, max_K):
    print(f"{S = }")
    verifier = HierarchicalVerifier(S)
    verifier.verify_up_to(max_K)


if __name__ == "__main__":
    # S = 1.7484269132952541    # 6
    # S = 3.6714297196879455    # 5
    # S = 28.428500061695253    # 4
    # S = 87.32442440535138     # 3
    # S = 769.7351525644638     # 2
    # S = 28.4285     # 4
    # S = 769.7351525644638       # 2

    # find()
    verify(3.675, 5)   # 1e-4, S=147/40