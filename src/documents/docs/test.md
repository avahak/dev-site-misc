# Structural Properties of Admissible Trees

In this section, we analyze tree structures under recursive node transformations.

<def id="def:admissible" title="Admissible Tree">

A rooted tree $T = (V, E)$ is said to be **admissible** if every internal node $v \in V$ at depth $k$ satisfies:
$$ \operatorname{weight}(v) \ge 2^{-k} \cdot \operatorname{weight}(\operatorname{root}(T)) $$

</def>

We now establish the main substitution property for an <ref to="def:admissible">admissible tree</ref>.

<lemma id="lem:node-replacement" title="Node Replacement $X=y^2$">

Let $T$ be an <ref to="def:admissible">admissible tree</ref> with a level-$k$ node $I$, and let $I'$ be another admissible level-$k$ node satisfying:
$$ a(I') \ge a(I) $$

Then the tree $T'$ obtained by replacing the subtree rooted at $I$ with the subtree rooted at $I'$ is admissible.

</lemma>
<proof>
<sketch>

Compare the weight distribution before and after replacement at level $k$. Since $a(I') \ge a(I)$, the monotonicity of the node weight bound is preserved across all levels $j \ge k$.

$$
x^2+y^2=1
$$

And so on.

</sketch>
<detail>

Let $\epsilon > 0$ be arbitrary. We proceed by induction on the height $h$ of the subtree rooted at $I$.

For the base case $h = 0$, the node $I$ is a leaf. Substituting $I'$ increases or preserves the total weight at level $k$:
$$ \operatorname{weight}_{T'}(I') = a(I') \ge a(I) = \operatorname{weight}_T(I) $$

By structural induction over all descendant nodes $v \in \operatorname{Subtree}(I')$, the bound holds for all depths $j \ge k$. Thus, $T'$ remains admissible.

</detail>
</proof>

As established in <ref to="lem:node-replacement">Lemma ($x^2+y^2=z^2$ Node Replacement)</ref>, subtree substitution preserves structural admissibility under non-decreasing weight conditions.