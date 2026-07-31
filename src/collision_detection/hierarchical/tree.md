## Loose spherical hierarchy for broad-phase collision detection

Let $(X,d)$ be a metric space. For two balls $B_1=B(p_1,r_1)$ and $B_2=B(p_2,r_2)$ define

$$\text{$B_1$ overlaps $B_2$ if $d(p_1,p_2) < r_1+r_2$,}$$

and

$$\text{$B_1$ encloses $B_2$ if $d(p_1,p_2)+r_2\le r_1$.}$$ 

If $B_1$ and $B_2$ do not overlap, then $B_1\cap B_2=\emptyset$. Likewise, if $B_1$ encloses $B_2$, then $B_2\subset B_1$. These predicates are defined by simple distance computations and agree with the usual notions of intersection and containment in $\R^n$ and many other metric spaces. Note that overlap is symmetric and enclosure is transitive.

Objects and regions in the algorithm are balls, specified by their centers and radii. Throughout the algorithm, overlap and enclosure are understood in the sense defined above.

Let $S>1$ be a constant scaling factor.

The structure is a tree that stores a set of objects represented by balls $O = B(c,r)$. Each object has a fixed radius $r>0$, time-varying center $c\in X$, and an associated fixed margin $\rho\ge 0$. The structure indexes them using a hierarchy of spherical regions.

Every non-root node is a region $R=B(q,S^k)$, where $q\in X$ is the center and $k\in\mathbb Z$ is the level of the region. The root is not geometric; it acts only as the top-level organizer. Regions of level $k_{\rm max}$ are the only children of the root, and there are no regions above level $k_{\rm max}$.

For an object $O=B(c,r)$, its admissible level is the unique integer $k$ such that

$$S^{k-1}\le r+\rho<S^k.$$

If $r+\rho\ge S^{k_{\rm max}}$, the object cannot be enclosed by any region and is stored directly under the root.

Whenever a new region is created, its center is initialized to the center of the child (object or region) that it is created to contain.

A region is *populated* if it stores at least one object. Every region maintains a neighbor list. Whenever a region becomes populated, initialize its neighbor list by finding every overlapping populated region and updating all neighbor lists symmetrically. Whenever a region becomes unpopulated, remove it from the neighbor lists of all its neighbors and clear its own neighbor list.

### Invariants

The tree satisfies the following invariants and its operations preserve them.

* **Object storage:** Every object is stored in exactly one region whose level is equal to its admissible level, or directly under the root. Every object maintains a reference to its parent node.

* **Enclosure:** Every parent region encloses each of its child regions and stored objects. 

* **Topology:** The parent of a level-$k$ region is either a level-$(k+1)$ region, or the root if $k=k_{\rm max}$.

* **Pruning:** Every region contains at least one stored object or at least one child region.

* **Neighbors:** The neighbor list of every populated region contains exactly the populated regions that overlap it, excluding itself. The neighbor list of every unpopulated region is empty.

Note that the enclosure invariant implies that every region encloses every descendant region and every object stored in its subtree.

### Overlap query

An overlap query takes three inputs: a query ball $B$, a minimum level $k_{\rm min}$, and a boolean flag `group_by_level`.

The output is every region in the tree that overlaps $B$ and whose level is at least $k_{\rm min}$. If `group_by_level = true`, the result is returned as a map from level to a list of matching regions.

The query traverses the tree top-down, starting from the root's children. For each visited region, test for overlap with $B$. If the region overlaps $B$ and its level is at least $k_{\rm min}$, include it in the output. Recurse only into children that overlap $B$. If a region's level is less than $k_{\rm min}$, it is not reported and its subtree is not traversed.

### Enclosure query

An enclosure query takes the same inputs as an overlap query.

The output is every region in the tree that encloses $B$ and whose level is at least $k_{\rm min}$. If `group_by_level = true`, the result is returned as a map from level to a list of matching regions.

The enclosure query traverses the tree analogously to the overlap query, replacing overlap tests with enclosure tests and descending only into child regions that enclose $B$.

*(Note: Overlap and enclosure queries return regions, not objects.)*

### Insertion

To insert an object $O = B(c,r)$:

1. Compute its admissible level $k$.
2. If $r+\rho \ge S^{k_{\rm max}}$, store $O$ directly under the root and terminate.
3. Otherwise, perform an enclosure query with query ball $O$, minimum level $k$, and `group_by_level = true`.
4. **Existing region:** Search the returned regions at level $k$ for any that enclose $O$. If one or more exist, select the region whose center is closest to $c$, store $O$ there, and if the region was previously unpopulated, populate it. Terminate.
5. **Create new region:** If no suitable level-$k$ region exists, create a new region $R_k = B(c,S^k)$. Store $O$ in $R_k$, populate $R_k$, and connect it upward.
6. **Connect upward:** Let $j := k$. Search the query results at level $j+1$ for a region that encloses $R_j$.
   * If one exists, select the one whose center is closest to $R_j$, assign it as the parent of $R_j$, and terminate.
   * If none exist and $j+1 \le k_{\rm max}$, create a new region $R_{j+1} = B(c,S^{j+1})$, make $R_j$ its child, set $j := j+1$, and repeat this step.
   * If $j = k_{\rm max}$ is reached without finding a parent, attach $R_{k_{\rm max}}$ directly to the root.

This procedure always reuses an existing valid region when possible and otherwise creates the shortest necessary chain of new ancestors.

### Deletion

To delete an object $O$:

1. Remove $O$ from its parent node.
2. If the node is a region and this removal transitions it to unpopulated, unpopulate it.
3. If the node is now empty (no stored objects and no child regions), remove it from its parent.
4. Apply the emptiness test iteratively to the parent, removing empty ancestors until a non-empty region or the root is reached.

### Updating after object movement

Suppose that object $O$ has moved to a new center while keeping the same radius. Let $H$ be its current parent node.

1. If $H$ is the root, or if $O$ is still enclosed in $H$, no structural changes are required. Terminate.
2. Otherwise, remove $O$ from $H$. If $H$ transitions to unpopulated, unpopulate it.
3. Insert $O$ back into the tree using the insertion procedure.
4. Clean up the old path: if $H$ is now empty, remove it from its parent. Apply this iteratively upward, deleting empty ancestors until a non-empty region or the root is reached.

*Note: Reinsertion strictly precedes pruning so that any valid ancestors of $H$ remain available for reuse during the insertion phase.*

## Collision detection

The tree accelerates broad-phase collision detection by exploiting the neighbor lists of populated regions. Objects stored under the root are compared separately.

1. Test every pair of objects stored directly under the root.
2. For each root object, test it against every object stored directly in a populated region that overlaps it.
3. For every populated region:
   * Test every pair of objects stored in that region.
   * For every neighboring populated region, test every object stored directly in one region against every object stored directly in the other.

Since neighbor lists are symmetric, each pair of neighboring regions must be processed only once.

Each candidate pair is then subjected to an exact overlap test between the two objects. The procedure reports every overlapping pair exactly once.

## Notes

The object radius and margin are assumed to remain fixed, so the admissible level of an object does not need to be recomputed. The update operation is therefore a localized relocation: preserve the current parent node when possible, otherwise move the object to an existing region or create only the minimum new structure needed to restore the invariants.

Neighbor lists depend only on populated regions. They are unaffected by changes to the tree topology and are updated only when a region transitions between populated and unpopulated.

## Bounding occupancy

**Lemma (Child separation).**  
Assume there exists a constant $C>0$ such that every object satisfies $\rho\ge Cr$. Let

$$\alpha=\min\!\left\{1-\frac1S,\frac{C}{1+C}\right\}.$$

Then the centers of the level-$k$ children of any level-$(k+1)$ region are $\alpha S^k$-separated.

**Proof.**  
Let $A$ be a level-$(k+1)$ region, and let $B=B(b,S^k)$ and $B'=B(b',S^k)$ be two distinct level-$k$ children of $A$. Assume $B$ was created after $B'$.

When $B$ was created, it was initialized with a single child $D$, whose center became the center of $B$. Thus $b$ is the center of $D$. Since $B'$ already existed and was not selected as the parent of $D$, the region $B'$ did not enclose $D$.

If $D$ is a level-$(k-1)$ region, then $D=B(b,S^{k-1})$, so

$$d(b,b')+S^{k-1}>S^k,$$

which implies

$$d(b,b')>\left(1-\frac1S\right)S^k\ge\alpha S^k.$$

If instead $D$ is an object of radius $r$, then

$$d(b,b')+r>S^k.$$

Since the object is admissible at level $k$,

$$r+\rho<S^k.$$

Together with the assumption $\rho\ge Cr$, this gives

$$(1+C)r\le r+\rho<S^k,$$

and therefore

$$r<\frac{S^k}{1+C}.$$

Substituting into the previous inequality yields

$$d(b,b')>S^k-r>S^k-\frac{S^k}{1+C}=\frac{C}{1+C}S^k\ge\alpha S^k.$$

Thus in either case,

$$d(b,b')>\alpha S^k,$$

so the centers of the level-$k$ children of $A$ are $\alpha S^k$-separated. $\square$

**Theorem (Bounded number of children).**  
Assume $(X,d)$ is a doubling metric space with doubling dimension $d$. Assume further that there exists a constant $C>0$ such that every object satisfies $\rho\ge Cr$. Then every level-$(k+1)$ region has at most

$$N=O\!\left(\left(\frac{S-1}{\alpha}\right)^d\right)$$

level-$k$ children, where

$$\alpha=\min\!\left\{1-\frac1S,\frac{C}{1+C}\right\}.$$

In particular, the number of children of a region is bounded by a constant depending only on $S$, $C$, and the doubling dimension of $(X,d)$.

**Proof.**  
By the previous lemma, the centers of the level-$k$ children are $\alpha S^k$-separated. Since every child region is enclosed by its parent, all child centers lie within distance $S^{k+1}-S^k=(S-1)S^k$ of the parent center. A standard packing bound for doubling metric spaces therefore implies that the number of such centers is at most

$$O\!\left(\left(\frac{(S-1)S^k}{\alpha S^k}\right)^d\right) = O\!\left(\left(\frac{S-1}{\alpha}\right)^d\right).$$

This bound is independent of $k$. $\square$