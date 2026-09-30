## The structure of the $L_k$ hierarchy

For an integer $n>1$, consider $S\in(n,n+1)$. From the previous results,

$$
C_k(S)\in\{n,n+1\},
$$

and

$$
L_k(S)=\prod_{i=1}^kC_i(S).
$$

We first record the piecewise-constant structure of the functions $C_k$ and $L_k$.

For a function $f:(n,n+1)\to\mathbb R$, we call $S_0\in(n,n+1)$ a **jump point** if the one-sided limits

$$
f(S_0^-)=\lim_{S\uparrow S_0}f(S),
\qquad
f(S_0^+)=\lim_{S\downarrow S_0}f(S)
$$

exist and are different.

Since

$$
C_1(S)=\lfloor S\rfloor=n,
$$

both $C_1$ and $L_1$ are constant on $(n,n+1)$.

Now suppose that $L_{k-1}$ is piecewise constant. Denote

$$
q_k(S)
=
\frac{(S-1)S^{k-1}}{L_{k-1}(S)}
$$

so that

$$
C_k(S)=\lfloor q_k(S)\rfloor+1.
$$

On every interval on which $L_{k-1}$ is constant, the function $q_k$ is strictly increasing. Since

$$
C_k(S)\in\{n,n+1\},
$$

the only possible change of $C_k$ on such an interval is an upward jump from $n$ to $n+1$. This occurs precisely when

$$
q_k(S)=n.
$$

Thus $C_k$ is piecewise constant, and consequently

$$
L_k=L_{k-1}C_k
$$

is also piecewise constant.

By induction, $C_k$ and $L_k$ are piecewise constant for every $k$.

We now determine the possible locations of the jumps.

Since

$$
C_1(S)=n,
$$

the factor $n$ occurs at least once in every $L_k$. Thus every possible value of $L_{k-1}$ has the form

$$
L_{k-1}=n^u(n+1)^v,
\qquad
u+v=k-1,
\qquad
u\ge1.
$$

At a jump of $C_k$, we have

$$
q_k(S)=n,
$$

and hence

$$
(S-1)S^{k-1}
=
nL_{k-1}(S).
$$

Substituting

$$
L_{k-1}=n^u(n+1)^v
$$

gives

$$
(S-1)S^{k-1}
=
n^{u+1}(n+1)^v.
$$

Writing $a=u+1$, we obtain the candidate equations

$$
(S-1)S^{k-1}
=
n^a(n+1)^{k-a},
\qquad
a=2,\ldots,k.
$$

This motivates the definition

$$
J_k
=
\left\{
S\in(n,n+1):
(S-1)S^{k-1}
=
n^a(n+1)^{k-a}
\text{ for some }a=2,\ldots,k
\right\}.
$$

Since

$$
S\mapsto(S-1)S^{k-1}
$$

is strictly increasing for $S>1$, each of these equations has at most one solution.

### Cancellation between consecutive levels

The key relation is

$$
q_{k+1}
=
\frac{Sq_k}{C_k}.
$$

Suppose that $C_k$ jumps upward at $S_0$. Then

$$
q_k(S_0)=n.
$$

Immediately before the jump,

$$
C_k(S_0^-)=n,
$$

and hence

$$
q_{k+1}(S_0^-)
=
\frac{S_0n}{n}
=
S_0
>
n.
$$

Immediately after the jump,

$$
C_k(S_0^+)=n+1,
$$

so

$$
q_{k+1}(S_0^+)
=
\frac{S_0n}{n+1}
<
n,
$$

because $S_0<n+1$.

Thus $C_{k+1}$ jumps downward at the same point:

$$
C_{k+1}(S_0^-)=n+1,
\qquad
C_{k+1}(S_0^+)=n.
$$

Consequently,

$$
L_k(S_0^-)
=
nL_{k-1}(S_0),
$$

while

$$
L_k(S_0^+)
=
(n+1)L_{k-1}(S_0).
$$

But at the next level,

$$
L_{k+1}(S_0^-)
=
(n+1)nL_{k-1}(S_0)
=
L_{k+1}(S_0^+).
$$

Thus an upward jump of $L_k$ is cancelled at the next level.

### The jump points of $L_k$

**Lemma**  
For every $k\ge1$, the function $L_k$ on $(n,n+1)$ is piecewise constant with exactly $k-1$ jump points given by

$$ 
J_k = \left\{ S\in(n,n+1): (S-1)S^{k-1} = n^a(n+1)^{k-a} \text{ for some }a=2,\ldots,k \right\}. 
$$

Moreover, as $S$ increases through $(n,n+1)$, the successive constant values of $L_k$ are

$$ 
n^k, \quad n^{k-1}(n+1), \quad \ldots, \quad n(n+1)^{k-1}. 
$$

**Proof**  
We proceed by induction on $k\ge1$.

For $k=1$, $L_1(S)=n$ throughout $(n,n+1)$. The set $J_1$ is empty, $L_1$ has no jump points, and it takes the single constant value $n^1$, so the statement holds.

Now suppose the claim holds for level $k-1\ge1$. By the induction hypothesis, $L_{k-1}$ has exactly $k-2$ jump points $s_1 < s_2 < \cdots < s_{k-2}$ in $(n,n+1)$. Setting $s_0=n$ and $s_{k-1}=n+1$, these points divide $(n,n+1)$ into $k-1$ open subintervals $I_r = (s_r, s_{r+1})$ for $r=0,\ldots,k-2$, on which $L_{k-1}$ takes the constant value

$$
L_{k-1}(S) = n^{k-1-r}(n+1)^r.
$$

On each subinterval $I_r$, the function 

$$
q_k(S) = \frac{(S-1)S^{k-1}}{L_{k-1}(S)}
$$

is continuous and strictly increasing.

To determine the behavior of $q_k$ on each subinterval, we check its limits at the endpoints. At the left endpoint $s_0=n$, we have $q_k(n^+)=n-1<n$. At the right endpoint $s_{k-1}=n+1$, we have $q_k((n+1)^-)=n+1>n$. At each internal boundary $s_r$ ($r=1,\ldots,k-2$), $C_{k-1}$ undergoes an upward jump, so by 

$$
q_k(S)=\frac{Sq_{k-1}(S)}{C_{k-1}(S)}
$$

and the inter-level cancellation result, $q_k(s_r^-) = s_rn/n > n$ and $q_k(s_r^+) = s_r n/(n+1) < n$.

Since $q_k$ is continuous and strictly increasing on $I_r$, starting strictly below $n$ and ending strictly above $n$, the Intermediate Value Theorem implies that $q_k(S)=n$ has a unique solution $x_{r+1} \in I_r$. Consequently, $C_k(S) = \lfloor q_k(S)\rfloor + 1$ jumps upward from $n$ to $n+1$ at $x_{r+1}$, and remains constant elsewhere on $I_r$.

It remains to check whether $L_k = L_{k-1}C_k$ has any jump points at the internal boundaries $s_r$. Since $s_r$ is a jump point of $C_{k-1}$, the cancellation property establishes that the upward jump in $L_{k-1}$ is exactly offset by the downward jump of $C_k$ across $s_r$, yielding $L_k(s_r^-) = L_k(s_r^+)$. Thus $L_k$ is continuous across each $s_r$.

Therefore, the jump points of $L_k$ on $(n,n+1)$ are precisely the $k-1$ points $x_1 < x_2 < \cdots < x_{k-1}$. The equation $q_k(x_{r+1})=n$ unwinds to

$$
(x_{r+1}-1)x_{r+1}^{k-1} = n^{k-r}(n+1)^r.
$$

Writing $a=k-r$, as $r$ ranges from $0$ to $k-2$, $a$ ranges from $k$ down to $2$, which shows that the jump points are precisely the elements of $J_k$.

Finally, as $S$ increases across $(n,n+1)$, $C_k$ equals $n$ on $(s_r, x_{r+1})$ and $n+1$ on $(x_{r+1}, s_{r+1})$. Multiplying by the constant value of $L_{k-1}$ on $I_r$ shows that $L_k$ takes the value $n^{k-r}(n+1)^r$ on $(x_r, x_{r+1})$, yielding the sequence of values $n^k, n^{k-1}(n+1), \ldots, n(n+1)^{k-1}$. $\blacksquare$

### Jump points at different levels are distinct

We now show that jump sets of different levels are disjoint.

**Lemma.**  
Let $n>1$ be an integer. Suppose that $S\in(n,n+1)$ satisfies

$$
(S-1)S^{k-1}
=
n^a(n+1)^{k-a}
$$

and

$$
(S-1)S^{j-1}
=
n^b(n+1)^{j-b},
$$

where

$$
k>j\ge2,
\qquad
2\le a\le k,
\qquad
2\le b\le j.
$$

Then this is impossible.

**Proof.**  
Dividing the two equations gives

$$
S^{k-j}
=
n^{a-b}(n+1)^{(k-a)-(j-b)}.
$$

Set

$$
m=k-j,
\qquad
p=a-b.
$$

Then

$$
S^m=n^p(n+1)^{m-p}.
$$

Since

$$
n<S<n+1,
$$

we have

$$
n^m<S^m<(n+1)^m.
$$

This forces

$$
0<p<m.
$$

Indeed, if $p\le0$, then

$$
n^p(n+1)^{m-p}\ge(n+1)^m,
$$

while if $p\ge m$, then

$$
n^p(n+1)^{m-p}\le n^m.
$$

Now let

$$
g=\gcd(p,m),
\qquad
p=gp',
\qquad
m=gm',
$$

so that

$$
\gcd(p',m')=1.
$$

Taking the $g$-th root of the equation above gives

$$
S^{m'}
=
n^{p'}(n+1)^{m'-p'}.
$$

Set

$$
A=n^{p'}(n+1)^{m'-p'}.
$$

Thus

$$
S^{m'}=A.
$$

We now use the standard irreducibility criterion for binomials: if a positive rational number $A$ is not a $q$-th power in $\mathbb Q$ for any prime $q\mid m'$, then

$$
X^{m'}-A
$$

is irreducible over $\mathbb Q$.

We claim that this criterion applies to

$$
A=n^{p'}(n+1)^{m'-p'}.
$$

Let $q$ be any prime dividing $m'$. Since

$$
\gcd(p',m')=1,
$$

neither $p'$ nor $m'-p'$ is divisible by $q$.

Also, $n$ and $n+1$ are coprime, and they cannot both be $q$-th powers in $\mathbb Q$, since they are consecutive integers. Hence at least one of $n$ and $n+1$ has a prime factor whose exponent in its prime factorization is not divisible by $q$.

If this prime factor comes from $n$, its exponent in $A$ is multiplied by $p'$, which is not divisible by $q$. If it comes from $n+1$, its exponent is multiplied by $m'-p'$, which is also not divisible by $q$.

Thus $A$ is not a $q$-th power in $\mathbb Q$. Since this holds for every prime $q\mid m'$, the binomial

$$
X^{m'}-A
$$

is irreducible over $\mathbb Q$.

Since $S$ is a root of this polynomial, its minimal polynomial over $\mathbb Q$ has degree $m'$. Consequently,

$$
1,S,\ldots,S^{m'-1}
$$

are linearly independent over $\mathbb Q$.

We now return to the first jump equation,

$$
S^k-S^{k-1}
=
n^a(n+1)^{k-a}.
$$

Its right-hand side is rational.

Since

$$
S^{m'}=A\in\mathbb Q,
$$

we can write

$$
k=qm'+r,
\qquad
k-1=q'm'+r',
$$

with

$$
0\le r,r'<m'.
$$

Thus

$$
S^k=A^qS^r,
\qquad
S^{k-1}=A^{q'}S^{r'}.
$$

The exponents $k$ and $k-1$ are consecutive, so

$$
r\ne r'.
$$

Therefore the first jump equation becomes a nontrivial rational linear relation among

$$
1,S,\ldots,S^{m'-1}.
$$

This contradicts their linear independence.

Hence no such $S$ can exist.
$\square$

As an immediate consequence,

$$
J_k\cap J_j=\varnothing
\qquad\text{whenever }k\ne j.
$$


### Density of the jump points

We now show that the union of the jump sets is dense.

Let

$$
J=\bigcup_{k\ge2}J_k.
$$

Fix $\theta\in(0,1)$. Choose integers $a_k$ such that

$$
2\le a_k\le k,
\qquad
\frac{a_k}{k}\longrightarrow\theta.
$$

By the jump-point lemma, for each $k$ there is a unique point $S_k\in J_k$ corresponding to the chosen $a_k$.

Taking $k$-th roots gives

$$
S_k
\left(1-\frac1{S_k}\right)^{1/k}
=
n^{a_k/k}(n+1)^{1-a_k/k}.
$$

The second factor on the left tends to $1$, while the right-hand side tends to

$$
n^\theta(n+1)^{1-\theta}.
$$

Hence

$$
S_k\longrightarrow
n^\theta(n+1)^{1-\theta}.
$$

The function

$$
\theta\longmapsto n^\theta(n+1)^{1-\theta}
$$

is continuous and strictly increasing, with range $(n,n+1)$. Therefore every point of $(n,n+1)$ is a limit of points in $J$, and hence $J$ is dense in $(n,n+1)$.

Since each $J_k$ is finite, $J$ is countable.

### Uniform convergence of the rebuild-rate series

We now use the structure of the $L_k$ to understand the dependence of the rebuild rate on $S$.

Recall that

$$
R(S)
=
\sum_{k=0}^{\infty}\frac1{L_k(S)}.
$$

Since $C_k(S)\ge n$, we have $L_k(S)\ge n^k$. Consequently,

$$
0<\frac1{L_k(S)}\le\frac1{n^k},
$$

for every $S\in(n,n+1)$.

Thus the tail satisfies

$$
\sup_{S\in(n,n+1)}
\sum_{k>K}\frac1{L_k(S)}
\le
\sum_{k>K}\frac1{n^k}
=
\frac{n^{-K-1}}{1-1/n}.
$$

In particular, the series defining $R$ converges uniformly on $(n,n+1)$.

This uniform tail estimate allows us to transfer the finite-level jump structure to the infinite sum.

### Continuity away from the jump set

Suppose that

$$
S_0\in(n,n+1)\setminus J.
$$

Fix $K$. Since

$$
S_0\notin J_1\cup\cdots\cup J_K,
$$

there is a neighborhood of $S_0$ containing none of these finitely many jump points. On this neighborhood,

$$
L_1,\ldots,L_K
$$

are all constant. Therefore the partial sum

$$
R_K(S)
=
\sum_{k=0}^K\frac1{L_k(S)}
$$

is constant on that neighborhood.

The remaining tail is uniformly bounded by

$$
\frac{n^{-K-1}}{1-1/n}.
$$

Since this bound tends to zero as $K\to\infty$, the full function $R$ is continuous at $S_0$.

Thus $R$ is continuous at every point outside $J$.

### The jumps of $R$

Now suppose that

$$
S_0\in J_k.
$$

Since the sets $J_k$ are pairwise disjoint, no other level has a jump at $S_0$. Thus only the $k$-th summand contributes to the jump of $R$.

At $S_0$, we have

$$
L_k(S_0^-)
=
nL_{k-1}(S_0),
$$

and

$$
L_k(S_0^+)
=
(n+1)L_{k-1}(S_0).
$$

Therefore

$$
R(S_0^+)-R(S_0^-)
=
\frac1{(n+1)L_{k-1}(S_0)}
-
\frac1{nL_{k-1}(S_0)}
=
-\frac1{n(n+1)L_{k-1}(S_0)}.
$$

Thus $R$ has a downward jump at every point of $J$. It remains only to determine the value of $R$ at the jump itself.

Since $q_k(S_0)=n$, we have

$$
C_k(S_0)
=
\lfloor q_k(S_0)\rfloor+1
=
n+1.
$$

Thus the value at the jump belongs to the upper branch: $L_k(S_0)=L_k(S_0^+)$. Therefore $R(S_0)=R(S_0^+)$.

We have therefore proved the following.

**Theorem**  
Fix an integer $n>1$ and consider the total rebuild rate

$$
R(S)
=
\sum_{k=0}^{\infty}\frac1{L_k(S)}
$$

on the interval $(n,n+1)$. Let

$$
J=
\bigcup_{k\ge2}J_k,
$$

where

$$
J_k
=
\left\{
S\in(n,n+1):
(S-1)S^{k-1}
=
n^a(n+1)^{k-a}
\text{ for some }a=2,\ldots,k
\right\}.
$$

Then:

1. $J$ is countable and dense in $(n,n+1)$.

2. $R$ is continuous at every point of

   $$
   (n,n+1)\setminus J.
   $$

3. Every point $S_0\in J_k$ is a discontinuity of $R$, with $R(S_0^+)=R(S_0)$ and 

   $$
   R(S_0^-)-R(S_0)
   =
   \frac1{n(n+1)L_{k-1}(S_0)}.
   $$

In particular, the discontinuity set of $R$ in $(n,n+1)$ is exactly $J$.

**Proof**  
The three claims follow respectively from the density result, the continuity argument, and the jump calculation above.
$\square$
