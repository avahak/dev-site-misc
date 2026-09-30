# Plots, tables, visualizing replacement strategies

import math
import matplotlib.pyplot as plt
from matplotlib.collections import LineCollection
import numpy as np
from typing import Optional

def custom_round(x: float, digits: int) -> str:
    if x.is_integer():
        return f"{int(x)}"
    if np.isclose(round(x, digits), x, atol=1e-10):
        return f"{x:.{digits}g}"
    return f"{x:.{digits}f}"

def create_latex_table(data_dict, num_cols=None):
    """
    Create a LaTeX table from a dictionary of data rows.
    """
    if num_cols is None:
        num_cols = max(len(values) for values in data_dict.values())
    
    header = "k & " + " & ".join(str(i) for i in range(num_cols)) + " \\\\"
    
    rows = []
    for row_name, values in data_dict.items():
        row = f"{row_name} & "
        row_values = []
        for i in range(num_cols):
            if i < len(values) and values[i] is not None:
                row_values.append(str(values[i]))
            else:
                row_values.append("")
        row += " & ".join(row_values) + " \\\\"
        rows.append(row)
    
    col_format = "c|" + "c" * (num_cols - 1)
    table = f"\\begin{{array}}{{{col_format}}}\n"
    table += header + "\n"
    table += "\\hline\n"
    table += "\n".join(rows) + "\n"
    table += "\\end{array}"
    
    return table


def save_image(fig, file_path: str, dpi=120):
    fig.savefig(file_path, transparent=False, dpi=dpi, bbox_inches='tight')
    print(f'Wrote image to file {file_path}.')


def solve_x(n: int, c: float, k: int, tol: float = 1e-12, max_iter: int = 100) -> Optional[float]:
    """
    Finds the unique x in (n, n + 1) such that x^k - x^(k - 1) = c.

    Parameters:
        n: Lower bound integer (n > 0).
        c: Target constant (c > 0).
        k: Exponent integer (k > 0).
        tol: Convergence tolerance for root finding.
        max_iter: Maximum number of Newton-Raphson iterations.

    Returns:
        The float root x in (n, n + 1) if it exists, otherwise None.
    """
    # Calculate boundary values f(n) and f(n + 1)
    f_n = (n ** k) - (n ** (k - 1))
    f_n1 = ((n + 1) ** k) - ((n + 1) ** (k - 1))

    # Check existence via Intermediate Value Theorem
    if not (f_n < c < f_n1):
        print(f"No solution x: {n=}, {c=}, {k=}. Interval ({f_n},{f_n1}).")
        return None

    # k = 1 reduces to linear equation: x - 1 = c  =>  x = c + 1
    if k == 1:
        return float(c + 1)

    # Newton-Raphson iteration initialized at the upper bound
    x = float(n + 1)
    for _ in range(max_iter):
        f_val = (x ** k) - (x ** (k - 1)) - c
        f_prime = (k * (x ** (k - 1))) - ((k - 1) * (x ** (k - 2)))

        dx = f_val / f_prime
        x -= dx

        if abs(dx) < tol:
            return x

    print(f"No solution x: {n=}, {c=}, {k=}")
    return None

def recurrence(S, kmax):
    N = [0]*(kmax+1)
    L = [0]*(kmax+1)

    N[0] = None
    L[0] = 1

    for k in range(1, kmax+1):
        x = S**(k-1)*(S-1) / L[k-1]
        N[k] = math.floor(x) + 1
        L[k] = L[k-1] * N[k]

    rate = 0
    for k in range(0, kmax+1):
        rate += 1 / L[k]
        #     print(L[k])

    ideal = S / (S-1)
    return {
        "N": N, 
        "L": L, 
        "L/S^k": [custom_round(L[k] / S**k, 3) for k in range(0, kmax+1)], 
        "ideal": ideal,
        "eta": ideal / rate,
        "rate": rate,
    }

def discontinuity_plot(ax, Ss, fn, color, threshold=0.01, label="Label"):
    points = np.column_stack([Ss, fn]).reshape(-1, 1, 2)
    segments = np.concatenate([points[:-1], points[1:]], axis=1)
    dy = np.diff(fn)
    s = np.array(Ss)
    # dworst = np.diff(s*(s-1)/(s**2-s+1))
    # is_jump = np.abs(dy) > 10*dworst
    is_jump = np.abs(dy) > threshold
    valid_segments = segments[~is_jump]
    jump_indices = np.where(is_jump)[0]
    lc = LineCollection(list(valid_segments), colors=color, linewidths=1.5, label=label)
    ax.add_collection(lc)
    for idx in jump_indices:
        x_jump = Ss[idx]
        y_left_limit = fn[idx]
        y_right_val = fn[idx + 1]
        # Subtle vertical drop line connecting left limit to defined value
        ax.vlines(
            x=x_jump, 
            ymin=y_right_val, 
            ymax=y_left_limit, 
            colors='gray', 
            linestyles=':', 
            linewidths=1,
            alpha=1
        )

def plot():
    kmax = 50
    LIMIT = 3
    Ss = []
    effs = []
    f1 = []
    f2 = []
    f3 = []
    f4 = []
    f51 = []
    f52 = []
    f61 = []
    f62 = []
    f63 = []
    f7 = []

    LN = 10+1
    Ls = [[] for k in range(LN)]
    Ns = [[] for k in range(LN)]

    for S in np.arange(1.05,4.2,0.0001):
        n = math.floor(S)
        rec = recurrence(S, kmax)
        Ss.append(S)
        effs.append(rec["eta"])

        ideal = S / (S-1)
        worst = (S*S-S+1)/(S-1)**2
        basic = n / (n-1) if n > 1 else math.nan

        f1.append((rec["rate"]-ideal) / (worst-ideal))
        f2.append((rec["ideal"]-ideal) / (worst-ideal))
        f3.append(rec["rate"])
        f4.append((basic-ideal) / (worst-ideal))
        f51.append(rec["ideal"])
        f52.append(worst)
        for k in range(1, LN):
            Ls[k].append(math.log(rec["L"][k]))
            Ns[k].append(2*k+rec["N"][k])

        bound1 = 0
        bound2 = 0
        bound3 = 0
        bound4 = 0
        for k in range(0, kmax+1):
            if k <= LIMIT:
                bound1 += 1 / rec["L"][k]
                bound2 += 1 / rec["L"][k]
                bound3 += 1 / rec["L"][k]
                bound4 += 1 / rec["L"][k]
            else:
                uk = max(n*math.floor((S-1)*S**(k-1)/n+1), n**(k))
                bound1 += 1 / uk

                ll = rec["L"][LIMIT]
                uk2 = max(ll*math.floor((S-1)*S**(k-1)/ll+1), ll*n**(k-LIMIT))
                bound2 += 1 / uk2

                n2 = rec["N"][2]
                n3 = rec["N"][3]
                af2 = min((n2+1)*n, S*S)
                ag2 = n2*n
                m3min = math.floor(((S-1)*S*S - af2)/ag2)+2
                l3min = min(n3*n2*n, (m3min*(n+1)+1)*n)
                uk3 = max(n*math.floor((S-1)*S**(k-1)/n+1), l3min*n**(k-LIMIT))
                bound3 += 1 / uk3

        f61.append((bound1-ideal) / (worst-ideal))
        f62.append((bound2-ideal) / (worst-ideal))
        f63.append((bound3-ideal) / (worst-ideal))

        f7.append((bound3-ideal) / (worst-ideal) - (rec["rate"]-ideal) / (worst-ideal))

    fig, ax = plt.subplots(figsize=(8,4.5))
    # plt.scatter(Ss, effs, color='red')
    # ax.plot(Ss, effs, 'o', markersize=1, label='$\\eta(S)$')
    # ax.plot(Ss, [S*(S-1)/(S*S-S+1) for S in Ss], label='Lower bound $\\frac{S(S-1)}{S^2-S+1}$')
    # ax.plot(Ss, f1, label='R / worst')
    # ax.plot(Ss, f2, '--', label='ideal / R_worst')
    # ax.plot(Ss, f3, label='R')
    # ax.plot(Ss, f4, label='normalized basic bound')
    # ax.plot(Ss, f51, label='ideal')
    # ax.plot(Ss, f52, label='worst')
    # ax.plot(Ss, f61, label=f"K={LIMIT} bound 1 / worst")
    # ax.plot(Ss, f62, label=f"K={LIMIT} bound 2 / worst")

    discontinuity_plot(ax, Ss, f4, color='orange', label='normalized upper bound $n/(n-1)$')
    discontinuity_plot(ax, Ss, f1, color='red', label="normalized geodesic rebuild rate $R$")
    # discontinuity_plot(ax, Ss, f61, color='yellow', label="basic bound")
    # discontinuity_plot(ax, Ss, f62, color='red', label="NOT CORRECT!")
    discontinuity_plot(ax, Ss, f63, color='blue', label="normalized improved upper bound")
    # discontinuity_plot(ax, Ss, f7, color='black', label="normalized geodesic rate vs upper bound")

    S0 = 147/40
    ideal0 = S0/(S0-1)
    worst0 = (S0*S0-S0+1)/(S0-1)**2
    plt.plot(147/40, (1.446927-ideal0)/(worst0-ideal0), 'ro', markersize=6, label='Counter-example, $S=3.675$')

    # ax.plot(Ss, f1, 'o', markersize=1, label='$R / R_{\\text{upper}}$')
    # ax.plot(Ss, f2, label='$R_{\\text{ideal}} / R_{\\text{upper}}$')

    # ax.plot(Ss, Ns[4], label=f"N_4")
    # ax.plot(Ss, Ns[5], label=f"N_5")
    for k in range(1, LN):
        pass
        # ax.plot(Ss, Ls[k], label=f"L_{k}")
        # ax.plot(Ss, Ns[k], label=f"N_{k}")

    # n = 5
    # for k in [7]:
    #     for j in range(2, k+1):
    #         x = solve_x(n, (n**j)*((n+1)**(k-j)), k)
    #         if x is None:
    #             print(f"ERROR! {n=}, {k=}, {j=}")
    #             return
    #         ax.axvline(x=x, color='red', linestyle='--')

    #     for j in range(1, k+1):
    #         ax.axhline(y=math.log((n**j)*((n+1)**(k-j))), color='green', linestyle='--')

    # ax.set_ylim(-0.05, 1.05)

    ax.legend()
    ax.grid(True, alpha=0.25)
    plt.xlabel("$S$")
    # plt.title(f"Rebuild rates and upper bounds")
    plt.title(f"Rebuild rate $R$")
    plt.grid(True)
    plt.show()

    save_image(fig, "./notes/eta.png", 120)
    save_image(fig, "../../../public/eta.png", 120)
    # save_image(fig, "./notes/bound.png", 120)
    # save_image(fig, "../../../public/bound.png", 120)

def plot2():
    kmax = 10
    K = 3      # for improved bound
    Ss = []
    f1 = []
    f2 = []
    f3 = []
    f4 = []
    f51 = []
    f52 = []
    f53 = []
    f54 = []
    f55 = []
    f61 = []
    f62 = []
    f7 = []


    for S in np.arange(1.05,10.5,0.005):
        n = math.floor(S)
        rec = recurrence(S, kmax)
        Ss.append(S)

        # worst = (S*S-S+1)/(S-1)**2
        f1.append(rec["rate"])
        # f3.append((S*S-S+1)/(S-1)**2)
        f3.append(0.003+n/(n-1) if n>1 else 0)

        n2 = rec["N"][2]
        n3 = rec["N"][3]
        m = n2 + 2

        g2_nodes = 1 + n2 + n2*n
        g2_leaves = n2*n
        g2_advance = n2*n

        f2_nodes = 1 + (n2+1) + (n2+1)*n
        f2_leaves = (n2+1)*n
        f2_advance = min((n2+1)*n,S*S)      # either can be chosen, depending on S

        g3_nodes = 1 + n3 + n3*n2 + n3*n2*n
        g3_leaves = n3*n2*n
        g3_advance = n3*n2*n

        added = { 3: 1, 2: 0 }
        removed = 1
        dn = added[3]*g3_nodes + added[2]*g2_nodes - removed*(1+m+m*n)
        dl = added[3]*g3_leaves + added[2]*g2_leaves - removed*(m*n)

        # Replacing lvl-2 node with one lvl-3 node (n+1)xG_2
        # dn = 1*(1 + (n+1)*(1+n2+n2*n)) - 1*(1+m+m*n)
        # dl = 1*((n+1)*n2*n) - 1*(m*n)

        # Replacing two lvl-1 nodes with one lvl-2 node (n+1)xG_1
        # removed = 2
        # dn = 1*(1 + (n+1) + (n+1)*n) - removed*(n+1)
        # dl = 1*((n+1)*n) - removed*(n)

        # Replacing excess lvl-1 node with one lvl-2 node G_2
        # removed = 2
        # dn = 1*(g2_nodes) - removed*(n+1)
        # dl = 1*(g2_leaves) - removed*(n)

        # ASSUME n2=n. Replacing one lvl-1 node with one lvl-2 node G_2=nxG_1
        # removed = 1
        # dn = 1*(1 + n + n*n) - removed*(n+1)
        # dl = 1*(n*n) - removed*(n)

        # f7.append(dn-rec["rate"]*dl)

        # Remove one F_2, add one G_3 to parent. This is only relevant for C_2=n+1.
        # +G_3-F_2 seems to work, what does this tell us? That modified tree is not admissible!
        # For lvl-4 parent: +(S-1)S^2, -S^2. For S>S_1 this is >=0. For S<S_1 we have C_2=n so this does not matter.
        # It tells us that if lvl-3 I has a child F_2, then C(I)<=C_3 because otherwise we can remove the F_2 and add G_3 to parent.
        # removed = 1
        # dn = 1*g3_nodes - removed*f2_nodes
        # dl = 1*g3_leaves - removed*f2_leaves
        # f7.append(dn-rec["rate"]*dl if n2 == n+1 else 1)

        # Remove two G_2, add one G_3 to parent.
        # Here we can assume I=[mxG_2] because otherwise we remove F_2 instead.
        # +G_3-2G_2 seems to work for R. What about advance? For lvl-4 parent: +(S-1)S^2, -S^2. For S>S_1 this is >=0.
        # This tells us that if S>S_1 then for lvl-3 I has C(I)<=C_3+1.
        # removed = 2
        # dn = 1*g3_nodes - removed*g2_nodes
        # dl = 1*g3_leaves - removed*g2_leaves
        # f7.append(dn-rec["rate"]*dl)

        # What about replacement with H=[(n+1)G_2] instead of G_3: +H-F_2.
        # Seems to works for R. Advance works just like before.
        # removed = 1
        # dn = 1*(1 + (n+1)*(1 + n2 + n2*n)) - removed*f2_nodes
        # dl = 1*((n+1)*n2*n) - removed*f2_leaves
        # f7.append(dn-rec["rate"]*dl if n2 == n+1 else 1)

        # And similarly for +H-2G_2
        # Seems to works for R. For advance: if S>S_1, then +(n+1)C_2n, -S^2 > 0. If S<S_1 then a(G_2)=1 so +2 -2 >= 0.
        removed = 1
        dn = 1*(1 + (n+1)*(1 + n2 + n2*n)) - removed*g2_nodes
        dl = 1*((n+1)*n2*n) - removed*g2_leaves
        f7.append(dn-rec["rate"]*dl)

        # check = n2*(n+1)-2*n-1 == dn and n*(n2-2) == dl and dl > 0
        f2.append(dn/dl if dl != 0 else math.inf)
        f61.append(dn)
        f62.append(dl)
        # f2.append((n+1)/n+1/(n*(n-2)) if n > 2 else 0)
        # f2.append(1 if check else 0)
        # f2.append((n2*(n+1)-2*n-1)/(n*(n2-2)) if n2 > 2 else 0)
        # Possible:
        # - m >= n2 + 2, remove 1, add 2 G_2:s
        # - remove 1, add 2 G_2:s, condition on S (low S-n)
        # - remove 2, add 3 G_2:s
        ## - remove 3, add 4 G_2:s (?)

        rK = 0
        for k in range(0, K+1):
            rK += 1 / rec["L"][k]
        f4.append(rK + 1/((S-1)**2*S**(K-1)))

        top1 = 0
        top2 = 0
        top3 = 0
        top4 = 0
        for k in range(K+1, kmax+1):
            top1 += 1 / ((S-1)*S**(k-1))
            top2 += 1 / (math.floor((S-1)*S**(k-1))+1)
            top3 += n**(-k)
            top4 += min(n**(-k), 1 / (math.floor((S-1)*S**(k-1))+1))
        top5 = min(S*(S**(-K)-S**(-kmax))/(S-1)**2, (n**(-K)-n**(-kmax))/(n-1) if n > 1 else kmax-K)

        f51.append(rK + top1)
        f52.append(rK + top2)
        f53.append(rK + top3)
        f54.append(rK + top4)
        f55.append(rK + top5)


    fig, ax = plt.subplots(figsize=(8,4.5))

    ax.plot(Ss, f1, markersize=1, label=f"R, {kmax=}")
    ax.plot(Ss, f2, label=f"target")
    # ax.plot(Ss, f3, label=f"basic upper bound")
    # ax.plot(Ss, f4, label=f"improved upper bound, {K=}")

    # ax.plot(Ss, f51, label=f"u_j with plain smooth")
    # ax.plot(Ss, f52, label=f"u_j with floors")
    # ax.plot(Ss, f53, label=f"u_j with n")
    ax.plot(Ss, f54, label=f"u_j with best out of n,floors")
    ax.plot(Ss, f55, label=f"improved upper bound, both, finite")
    ax.plot(Ss, f61, label=f"dn")
    ax.plot(Ss, f62, label=f"dl")
    ax.plot(Ss, f7, label=f"dn-R(T)*dl")

    ax.legend()
    ax.grid(True, alpha=0.5)
    plt.xlabel("$S$")
    plt.grid(True)
    plt.show()

def series(S, n):
    rec = recurrence(S, n)
    print(f"{S=}")
    print(f"{rec["rate"]=}, {rec["ideal"]=}, {rec["eta"]=}")
    print(f"{rec["N"]=}")
    print(f"{rec["L"]=}")
    print(f"{rec["L/S^k"]=}")

    rec1 = recurrence(1.5, n)
    rec2 = recurrence(2.0, n)
    rec3 = recurrence(2.5, n)
    table = create_latex_table({
        "1N_k": rec1["N"],
        "2L_k/S^k": rec1["L/S^k"],
        "3N_k": rec2["N"],
        "4L_k/S^k": rec2["L/S^k"],
        "5N_k": rec3["N"],
        "6L_k/S^k": rec3["L/S^k"],
    }, num_cols=n+1)

    # print()
    # print(table)


def plot3():
    Ss = []
    f1 = []
    f2 = []
    f3 = []
    f4 = []
    f5 = []

    for S in np.arange(1.05,5.5,0.005):
        Ss.append(S)
        n = math.floor(S)
        rec = recurrence(S, 10)

        assert rec["N"][1] == n
        C1 = rec["N"][1]
        C2 = rec["N"][2]
        C3 = rec["N"][3]
        C4 = rec["N"][4]

        ag2 = min(C2*n, S*S)
        af2 = min((C2+1)*n, S*S)
        af2p = min((C2+2)*n, S*S)

        sat3 = math.ceil(S*S*S/ag2)

        # advance increase for 2F_2->3G_2
        f1.append(3*ag2-2*af2)
        f2.append(2*ag2-1*af2)
        f3.append(2*ag2-1*af2p)
        # f4.append(C2+1-math.ceil(S*S/n))
        f5.append(sat3 - C3)

    fig, ax = plt.subplots(figsize=(8,4.5))

    # ax.plot(Ss, f1, label=f"advance increase for 2F_2->3G_2")
    # ax.plot(Ss, f2, label=f"advance increase for F_2->2G_2")
    # ax.plot(Ss, f3, label=f"advance increase for F_2p->2G_2")
    # ax.plot(Ss, f4, label=f"C2+1-math.ceil(S*S/n)")
    ax.plot(Ss, f5, label=f"max extras 3")

    ax.legend()
    ax.grid(True, alpha=0.5)
    plt.xlabel("$S$")
    plt.grid(True)
    plt.show()

def example():
    kmax = 5
    S = 147/40
    n = math.floor(S)
    rec = recurrence(S, kmax)

    ideal = S / (S-1)
    worst = (S*S-S+1)/(S-1)**2

    n2 = rec["N"][2]
    n3 = rec["N"][3]
    af2 = min((n2+1)*n, S*S)
    ag2 = n2*n
    m3min = math.floor(((S-1)*S*S - af2)/ag2)+2
    l3min = min(n3*n2*n, (m3min*(n+1)+1)*n)

    bound = 0
    for k in range(0, kmax+1):
        if k <= 3:
            bound += 1 / rec["L"][k]
        else:
            uk = max(n*math.floor((S-1)*S**(k-1)/n+1), l3min*n**(k-3))
            bound += 1 / uk

    print(f"Example:")
    print(f"{S=:.9f}")
    print(f"{ideal=:.9f}")
    print(f"{worst=:.9f}")
    print(f"{n/(n-1)=:.9f}")
    print(f"---")
    print(f"R(G_5(S))={833/576:.9f}")
    print(f"R(counter-example)={781/540:.9f}")
    print(f"---")
    print(f"a(G_2)={ag2:.9f}, a(F_2)={af2:.9f}")
    print(f"m_3^min={m3min:.9f}, ell_3^min={l3min:.9f}")
    print(f"{bound=:.9f}")

def plot_eta():
    kmax = 50
    Ss = []
    effs = []
    f1 = []
    f2 = []
    f3 = []
    f4 = []
    f51 = []
    f52 = []

    for S in np.arange(1.05,4.2,0.0001):
        n = math.floor(S)
        rec = recurrence(S, kmax)
        Ss.append(S)
        effs.append(rec["eta"])

        ideal = S / (S-1)
        worst = (S*S-S+1)/(S-1)**2
        basic = n / (n-1) if n > 1 else math.nan

        f1.append((rec["rate"]-ideal) / (worst-ideal))
        f2.append((rec["ideal"]-ideal) / (worst-ideal))
        f3.append(rec["rate"])
        f4.append((basic-ideal) / (worst-ideal))
        f51.append(rec["ideal"])
        f52.append(worst)

    fig, ax = plt.subplots(figsize=(10,4))

    discontinuity_plot(ax, Ss, f1, color='blue', label="Normalized geodesic rebuild rate $R$")

    # ax.legend()
    ax.grid(True, alpha=0.4)
    plt.xlabel("$S$")
    plt.title(f"Normalized geodesic rebuild rate $R$")
    plt.grid(True)
    plt.show()
    save_image(fig, "./notes/eta.png", 120)
    save_image(fig, "../../../public/eta.png", 120)

def plot_bound():
    kmax = 50
    LIMIT = 3
    Ss = []
    effs = []
    f1 = []
    f2 = []
    f3 = []
    f4 = []
    f51 = []
    f52 = []
    f61 = []
    f62 = []
    f63 = []
    f7 = []

    for S in np.arange(1.05,4.2,0.0001):
        n = math.floor(S)
        rec = recurrence(S, kmax)
        Ss.append(S)
        effs.append(rec["eta"])

        ideal = S / (S-1)
        worst = (S*S-S+1)/(S-1)**2
        basic = n / (n-1) if n > 1 else math.nan

        f1.append((rec["rate"]-ideal) / (worst-ideal))
        f2.append((rec["ideal"]-ideal) / (worst-ideal))
        f3.append(rec["rate"])
        f4.append((basic-ideal) / (worst-ideal))
        f51.append(rec["ideal"])
        f52.append(worst)

        bound1 = 0
        bound2 = 0
        bound3 = 0
        bound4 = 0
        for k in range(0, kmax+1):
            if k <= LIMIT:
                bound1 += 1 / rec["L"][k]
                bound2 += 1 / rec["L"][k]
                bound3 += 1 / rec["L"][k]
                bound4 += 1 / rec["L"][k]
            else:
                uk = max(n*math.floor((S-1)*S**(k-1)/n+1), n**(k))
                bound1 += 1 / uk

                ll = rec["L"][LIMIT]
                uk2 = max(ll*math.floor((S-1)*S**(k-1)/ll+1), ll*n**(k-LIMIT))
                bound2 += 1 / uk2

                n2 = rec["N"][2]
                n3 = rec["N"][3]
                af2 = min((n2+1)*n, S*S)
                ag2 = n2*n
                m3min = math.floor(((S-1)*S*S - af2)/ag2)+2
                l3min = min(n3*n2*n, (m3min*(n+1)+1)*n)
                uk3 = max(n*math.floor((S-1)*S**(k-1)/n+1), l3min*n**(k-LIMIT))
                bound3 += 1 / uk3

        f61.append((bound1-ideal) / (worst-ideal))
        f62.append((bound2-ideal) / (worst-ideal))
        f63.append((bound3-ideal) / (worst-ideal))

        f7.append((bound3-ideal) / (worst-ideal) - (rec["rate"]-ideal) / (worst-ideal))

    fig, ax = plt.subplots(figsize=(10,4))

    discontinuity_plot(ax, Ss, f4, color='red', label='Normalized upper bound $n/(n-1)$')
    discontinuity_plot(ax, Ss, f1, color='black', label="Normalized geodesic rebuild rate $R$")
    # discontinuity_plot(ax, Ss, f61, color='yellow', label="basic bound")
    # discontinuity_plot(ax, Ss, f62, color='red', label="NOT CORRECT!")
    discontinuity_plot(ax, Ss, f63, color='blue', label="Normalized improved upper bound")
    # discontinuity_plot(ax, Ss, f7, color='black', label="normalized geodesic rate vs upper bound")

    S0 = 147/40
    ideal0 = S0/(S0-1)
    worst0 = (S0*S0-S0+1)/(S0-1)**2
    plt.plot(147/40, (1.446927-ideal0)/(worst0-ideal0), 'ro', markersize=6, label='Counter-example, $S=3.675$')

    ax.set_ylim(-0.05, 1.05)
    ax.legend()
    ax.grid(True, alpha=0.4)
    plt.xlabel("$S$")
    plt.title(f"Rebuild rates and upper bounds")
    plt.grid(True)
    plt.show()
    save_image(fig, "./notes/bound.png", 120)
    save_image(fig, "../../../public/bound.png", 120)

if __name__ == '__main__':
    # print(custom_round(1.5, 2))
    # plot()
    # plot2()
    # plot3()
    # series(2.95, 32)
    # series(3.0, 22)

    # example()

    # plot_eta()
    plot_bound()