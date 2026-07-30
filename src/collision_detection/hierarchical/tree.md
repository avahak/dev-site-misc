## Loose spherical hierarchy for broad-phase collision detection

Let $S>1$ be a scaling factor.

The structure stores a set of objects represented by balls $O = B(c,r)$ with a fixed radius $r$ and a time-varying center $c$. The tree indexes them using a hierarchy of spherical regions. Every non-root node is a region $R = B(q, S^k)$, where $k \in \mathbb{Z}$ is the level of the region. The root is not geometric; it acts only as the top-level organizer. Regions of level $k_{\rm max}$ are the only children of the root, and there are no regions above level $k_{\rm max}$.

The algorithm only requires distance metric, no specific coordinate system. The underlying implementation must provide containment and intersection tests for balls.

A fixed parameter $M > 1$ controls looseness. For an object $O = B(c,r)$, its admissible level is the unique integer $k$ such that

$$S^{k-1} \le Mr < S^k.$$

If $Mr \ge S^{k_{\rm max}}$, the object is too large for any region and is stored directly under the root.

### Invariants

The tree satisfies the following invariants:

* **Geometry:** Every non-root node is a region whose radius is exactly $S^k$ for its level $k$. When a new region is created, its center is identical to the center of the child it will contain.
* **Containment:** Every object is stored in exactly one region (or the root) and maintains a reference to that node. Every child region and stored object is fully contained by its parent region. Therefore every region is a bounding ball for every region and object in its subtree.
* **Topology:** The parent of a level-$k$ region is either a level-$(k+1)$ region, or the root if $k = k_{\rm max}$.
* **Pruning:** Every region must contain at least one stored object or at least one child region.
* **Population:** A region is *populated* if it stores at least one object. Every populated region maintains a neighbor list containing exactly the populated regions that intersect it, excluding itself. Neighbor lists are symmetric: if region $A$ lists region $B$, then region $B$ lists region $A$. Every unpopulated region maintains an empty neighbor list.

Whenever a region becomes populated, initialize its neighbor list by finding every intersecting populated region and symmetrically updating all neighbor lists. Whenever a region becomes unpopulated, remove it from the neighbor lists of all its neighbors and clear its own neighbor list.

### Intersection query

An intersection query takes three inputs: a query ball $B$, a minimum level $k_{\rm min}$, and a boolean flag `group_by_level`.

The output is every region in the tree that intersects $B$ and whose level is at least $k_{\rm min}$. If `group_by_level = true`, the result is returned as a map from level to a list of matching regions.

The query is performed top-down, starting from the root's children. For each visited region, test for intersection with $B$. If the region intersects $B$ and its level is at least $k_{\rm min}$, include it in the output. Recurse only into children that intersect $B$. If a region's level is less than $k_{\rm min}$, it is not reported and its subtree is not traversed.

### Containment query

A containment query takes the same inputs as an intersection query.

The output is every region in the tree that fully contains $B$ and whose level is at least $k_{\rm min}$. If `group_by_level = true`, the result is returned as a map from level to a list of matching regions.

The query is performed analogously to the intersection query, replacing intersection tests with containment tests and descending only into child regions that fully contain $B$.

*(Note: Intersection and containment queries return regions, not objects.)*

### Insertion

To insert an object $O = B(c,r)$:

1. Compute its admissible level $k$.
2. If $Mr \ge S^{k_{\rm max}}$, store $O$ directly under the root and terminate.
3. Otherwise, perform a containment query with query ball $O$, minimum level $k$, and `group_by_level = true`.
4. **Target Resolution:** Search the returned regions at level $k$ for any that contain $O$. If one or more exist, select the region whose center is closest to $c$, store $O$ there, and if the region was previously unpopulated, populate it. Terminate.
5. **Region Creation:** If no suitable level-$k$ region exists, create a new region $R_k = B(c,S^k)$. Store $O$ in $R_k$, populate $R_k$, and connect it upward.
6. **Connecting Upward:** Let $j := k$. Search the query results at level $j+1$ for a region that fully contains $R_j$.
   * If one exists, select the one whose center is closest to $R_j$, assign it as the parent of $R_j$, and terminate.
   * If none exist and $j+1 \le k_{\rm max}$, create a new region $R_{j+1} = B(c,S^{j+1})$, make $R_j$ its child, set $j := j+1$, and repeat this step.
   * If $j = k_{\rm max}$ is reached without finding a parent, attach $R_{k_{\rm max}}$ directly to the root.

This procedure always reuses an existing valid region when possible and otherwise creates the shortest necessary chain of new ancestors.

### Deletion

To delete an object $O$:

1. Remove $O$ from its storage node.
2. If the node is a region and this removal transitions it to unpopulated, unpopulate it.
3. If the node is now entirely empty (no stored objects and no child regions), remove it from its parent.
4. Apply the emptiness test iteratively to the parent, removing empty ancestors until a non-empty region or the root is reached.

### Updating after object movement

Let object $O$ move to a new center while keeping the same radius. Let $H$ be its current storage node.

1. If $H$ is the root, or if $O$ is still fully contained in $H$, no structural changes are required. Terminate.
2. Otherwise, remove $O$ from $H$. If $H$ transitions to unpopulated, unpopulate it.
3. Insert $O$ using the standard insertion procedure.
4. Clean up the old path: if $H$ is now entirely empty, remove it from its parent. Apply this iteratively upward, deleting empty ancestors until a non-empty region or the root is reached.

*Note: Reinsertion strictly precedes pruning so that any valid ancestors of $H$ remain available for reuse during the insertion phase.*

## Notes on Behavior

The object radius never changes during updates, so the admissible level of an object is determined entirely by its radius and does not need to be recomputed. The update operation is therefore a localized relocation: preserve the current storage node when possible, otherwise move the object to the smallest valid existing region or create only the minimum new structure needed to restore the invariants.

Neighbor lists depend only on populated regions and their bounding balls. They are unaffected by changes to the tree topology and are updated only when a region transitions between populated and unpopulated.