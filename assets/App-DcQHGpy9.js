import{i as e,n as t,t as n}from"./jsx-runtime-BnxRlLMJ.js";import{c as r,o as i,s as a}from"./createTheme-DAYWABYe.js";import{c as o,f as s,i as c,r as l,s as u,t as d}from"./createSimplePaletteValueFilter-CwxCxLft.js";import{n as f,t as p,u as m}from"./CircularProgress-ZqFSp_4K.js";import{t as h}from"./Paper-BJ5_r9Z8.js";import{a as g,i as _,r as v,t as y}from"./index-B3067CQA.js";function b(e){return a(`MuiIconButton`,e)}var x=i(`MuiIconButton`,[`root`,`disabled`,`colorInherit`,`colorPrimary`,`colorSecondary`,`colorError`,`colorInfo`,`colorSuccess`,`colorWarning`,`edgeStart`,`edgeEnd`,`sizeSmall`,`sizeMedium`,`sizeLarge`,`loading`,`loadingIndicator`,`loadingWrapper`]),S=e(t()),C=n(),w=e=>{let{classes:t,disabled:n,color:r,edge:i,size:a,loading:o}=e;return s({root:[`root`,o&&`loading`,n&&`disabled`,r!==`default`&&`color${u(r)}`,i&&`edge${u(i)}`,`size${u(a)}`],loadingIndicator:[`loadingIndicator`],loadingWrapper:[`loadingWrapper`]},b,t)},T=o(f,{name:`MuiIconButton`,slot:`Root`,overridesResolver:(e,t)=>{let{ownerState:n}=e;return[t.root,n.loading&&t.loading,n.color!==`default`&&t[`color${u(n.color)}`],n.edge&&t[`edge${u(n.edge)}`],t[`size${u(n.size)}`]]}})(c(({theme:e})=>({textAlign:`center`,flex:`0 0 auto`,fontSize:e.typography.pxToRem(24),padding:8,borderRadius:`50%`,color:(e.vars||e).palette.action.active,transition:e.transitions.create(`background-color`,{duration:e.transitions.duration.shortest}),variants:[{props:e=>!e.disableRipple,style:{"--IconButton-hoverBg":e.alpha((e.vars||e).palette.action.active,(e.vars||e).palette.action.hoverOpacity),"&:hover":{backgroundColor:`var(--IconButton-hoverBg)`,"@media (hover: none)":{backgroundColor:`transparent`}}}},{props:{edge:`start`},style:{marginLeft:-12}},{props:{edge:`start`,size:`small`},style:{marginLeft:-3}},{props:{edge:`end`},style:{marginRight:-12}},{props:{edge:`end`,size:`small`},style:{marginRight:-3}}]})),c(({theme:e})=>({variants:[{props:{color:`inherit`},style:{color:`inherit`}},...Object.entries(e.palette).filter(d()).map(([t])=>({props:{color:t},style:{color:(e.vars||e).palette[t].main}})),...Object.entries(e.palette).filter(d()).map(([t])=>({props:{color:t},style:{"--IconButton-hoverBg":e.alpha((e.vars||e).palette[t].main,(e.vars||e).palette.action.hoverOpacity)}})),{props:{size:`small`},style:{padding:5,fontSize:e.typography.pxToRem(18)}},{props:{size:`large`},style:{padding:12,fontSize:e.typography.pxToRem(28)}}],[`&.${x.disabled}`]:{backgroundColor:`transparent`,color:(e.vars||e).palette.action.disabled},[`&.${x.loading}`]:{color:`transparent`}}))),E=o(`span`,{name:`MuiIconButton`,slot:`LoadingIndicator`})(({theme:e})=>({display:`none`,position:`absolute`,visibility:`visible`,top:`50%`,left:`50%`,transform:`translate(-50%, -50%)`,color:(e.vars||e).palette.action.disabled,variants:[{props:{loading:!0},style:{display:`flex`}}]})),D=S.forwardRef(function(e,t){let n=l({props:e,name:`MuiIconButton`}),{edge:i=!1,children:a,className:o,color:s=`default`,disabled:c=!1,disableFocusRipple:u=!1,size:d=`medium`,id:f,loading:h=null,loadingIndicator:g,..._}=n,v=m(f),y=g??(0,C.jsx)(p,{"aria-labelledby":v,color:`inherit`,size:16}),b={...n,edge:i,color:s,disabled:c,disableFocusRipple:u,loading:h,loadingIndicator:y,size:d},x=w(b);return(0,C.jsxs)(T,{id:h?v:f,className:r(x.root,o),centerRipple:!0,focusRipple:!u,disabled:c||h,ref:t,..._,ownerState:b,children:[typeof h==`boolean`&&(0,C.jsx)(`span`,{className:x.loadingWrapper,style:{display:`contents`},children:(0,C.jsx)(E,{className:x.loadingIndicator,ownerState:b,children:h&&y})}),a]})});o(`div`)({position:`relative`}),o(D,{shouldForwardProp:e=>e!==`isOpen`})(({theme:e,isOpen:t})=>({float:`left`,padding:2,marginTop:2,marginRight:e.spacing(1),color:e.palette.text.secondary,border:`3px solid ${e.palette.primary.main}`,borderRadius:e.shape.borderRadius,opacity:.15,transition:e.transitions.create([`transform`,`border-color`,`color`,`opacity`],{duration:e.transitions.duration.standard}),transform:t?`rotate(90deg)`:`rotate(0deg)`,".is-active &":{opacity:.85},"&:hover, &:focus":{opacity:1,color:e.palette.text.primary,borderColor:e.palette.primary.main,backgroundColor:`transparent`}})),o(`span`)(({theme:e})=>({color:`inherit`,cursor:`pointer`,borderBottom:`1px dotted transparent`,transition:e.transitions.create([`color`,`border-color`,`background-color`],{duration:e.transitions.duration.standard}),".is-active &":{color:e.palette.info.light,borderBottomColor:e.palette.info.light,fontWeight:500},"&:hover":{color:e.palette.info.light,borderBottomColor:e.palette.info.light,backgroundColor:e.palette.action.selected}})),o(`div`)(({theme:e})=>({fontWeight:700,margin:e.spacing(0),padding:e.spacing(0),color:e.palette.text.primary})),o(`div`)(({theme:e})=>({padding:e.spacing(1),margin:e.spacing(0,0),borderLeft:`4px solid ${e.palette.primary.main}`,backgroundColor:e.palette.action.hover,borderRadius:e.shape.borderRadius})),o(`div`)(({theme:e})=>({"& > p:first-of-type":{marginTop:0},"& > p:last-of-type":{marginBottom:0}})),o(h)(({theme:e})=>({padding:e.spacing(2),maxWidth:500,border:`1px solid ${e.palette.divider}`,boxShadow:e.shadows[8]})),o(g)(({theme:e})=>({margin:e.spacing(0,0),"&::after":{content:`""`,display:`table`,clear:`both`}})),o(g)(({theme:e})=>({borderRadius:e.shape.borderRadius,padding:e.spacing(0,1),transition:e.transitions.create([`box-shadow`,`background-color`],{duration:e.transitions.duration.shorter}),"&:hover":{}})),o(g)({}),(0,S.createContext)({mode:`summary`,toggleMode:()=>{}}),(0,S.createContext)(null);var O=`# Lorem Ipsum Dolor Sit Amet\r
\r
Lorem ipsum dolor sit amet, consectetur adipiscing elit. In this section, we analyze lorem ipsum dolor sit amet under consectetur adipiscing elit.\r
\r
<def id="def:admissible" title="Lorem Ipsum Dolor">\r
\r
A rooted tree $T = (V, E)$ is said to be **lorem ipsum** if every internal node $v \\in V$ at depth $k$ satisfies:\r
$$ \\operatorname{weight}(v) \\ge 2^{-k} \\cdot \\operatorname{weight}(\\operatorname{root}(T)) $$\r
\r
</def>\r
\r
Lorem ipsum dolor sit amet, consectetur adipiscing elit. We now establish the main substitution property for an <ref to="def:admissible">lorem ipsum</ref>.\r
\r
<lemma id="lem:node-replacement" title="Node Replacement $X=y^2$">\r
\r
Let $T$ be an <ref to="def:admissible">lorem ipsum</ref> with a level-$k$ node $I$, and let $I'$ be another lorem ipsum level-$k$ node satisfying:\r
$$ a(I') \\ge a(I) $$\r
\r
Then the tree $T'$ obtained by replacing the subtree rooted at $I$ with the subtree rooted at $I'$ is lorem ipsum.\r
\r
</lemma>\r
<proof>\r
<sketch>\r
\r
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Compare the weight distribution before and after replacement at level $k$. Since $a(I') \\ge a(I)$, the monotonicity of the node weight bound is preserved across all levels $j \\ge k$.\r
\r
$$\r
x^2+y^2=1\r
$$\r
\r
And so on.\r
\r
</sketch>\r
<detail>\r
\r
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Let $\\epsilon > 0$ be arbitrary. We proceed by induction on the height $h$ of the subtree rooted at $I$.\r
\r
For the base case $h = 0$, the node $I$ is a leaf. Substituting $I'$ increases or preserves the total weight at level $k$:\r
$$ \\operatorname{weight}_{T'}(I') = a(I') \\ge a(I) = \\operatorname{weight}_T(I) $$\r
\r
Lorem ipsum dolor sit amet, consectetur adipiscing elit. By structural induction over all descendant nodes $v \\in \\operatorname{Subtree}(I')$, the bound holds for all depths $j \\ge k$. Thus, $T'$ remains lorem ipsum.\r
\r
</detail>\r
</proof>\r
\r
Lorem ipsum dolor sit amet, consectetur adipiscing elit. As established in <ref to="lem:node-replacement">Lemma ($x^2+y^2=z^2$ Node Replacement)</ref>, subtree substitution preserves structural lorem ipsum under non-decreasing weight conditions.`,k=`## Loose spherical hierarchy for broad-phase collision detection\r
\r
Let $(X,d)$ be a metric space. For two balls $B_1=B(p_1,r_1)$ and $B_2=B(p_2,r_2)$ define\r
\r
$$\r
\\text{$B_1$ overlaps $B_2$ if $d(p_1,p_2) < r_1+r_2$,}\r
$$\r
\r
and\r
\r
$$\r
\\text{$B_1$ encloses $B_2$ if $d(p_1,p_2)+r_2\\le r_1$.}\r
$$ \r
\r
If $B_1$ and $B_2$ do not overlap, then $B_1\\cap B_2=\\emptyset$. Likewise, if $B_1$ encloses $B_2$, then $B_2\\subset B_1$. These predicates are defined by simple distance computations and agree with the usual notions of intersection and containment in $\\R^n$ and many other metric spaces. Note that overlap is symmetric, enclosure is transitive, and if two balls don't overlap, neither does any pair of balls enclosed respectively by them.\r
\r
Objects and regions in the algorithm are balls, specified by their centers and radii. Throughout the algorithm, overlap and enclosure are understood in the sense defined above.\r
\r
Let $S>1$ be a constant scaling factor.\r
\r
The structure is a tree that stores a set of objects represented by balls $O = B(c,r)$. Each object has a fixed radius $r>0$, time-varying center $c\\in X$, and an associated fixed margin $\\rho\\ge 0$. The structure indexes them using a hierarchy of spherical regions.\r
\r
Every non-root node is a region $R=B(q,S^k)$, where $q\\in X$ is the center and $k\\in\\Z$ is the level of the region. The root is not geometric; it acts only as the top-level organizer. Regions of level $k_{\\rm max}$ are the only children of the root, and there are no regions above level $k_{\\rm max}$. Regions never move.\r
\r
For an object $O=B(c,r)$, its admissible level is the unique integer $k$ such that\r
\r
$$\r
S^{k-1}\\le r+\\rho<S^k.\r
$$\r
\r
If $r+\\rho\\ge S^{k_{\\rm max}}$, the object with its margin cannot be enclosed by any region and the object is stored directly under the root.\r
\r
Whenever a new region is created, its center is initialized to the center of the ball (object or region) that it is created to contain.\r
\r
A region is *populated* if it stores at least one object. Every region maintains a neighbor list. Whenever a region becomes populated, initialize its neighbor list by finding every overlapping populated region using an overlap query (defined below) and updating all neighbor lists symmetrically. Whenever a region becomes unpopulated, remove it from the neighbor lists of all its neighbors and clear its own neighbor list.\r
\r
### Invariants\r
\r
The tree satisfies the following invariants and its operations preserve them.\r
\r
* **Object storage:** Every object is stored in exactly one region whose level is equal to its admissible level, or directly under the root. Every object maintains a reference to its parent node.\r
\r
* **Enclosure:** Every parent region encloses each of its child regions and stored objects. \r
\r
* **Topology:** The parent of a level-$k$ region is either a level-$(k+1)$ region, or the root if $k=k_{\\rm max}$.\r
\r
* **Pruning:** Every region contains at least one stored object or at least one child region.\r
\r
* **Neighbors:** The neighbor list of every populated region contains exactly the populated regions that overlap it, excluding itself. The neighbor list of every unpopulated region is empty.\r
\r
Note that the enclosure invariant implies that every region encloses every descendant region and every object stored in its subtree.\r
\r
### Overlap and enclosure queries\r
\r
We define two similar queries, overlap and enclosure, which differ only in the geometric predicate used to test a region against the query ball. The method below is described for the overlap query and the changes required for the enclosure query are indicated in parentheses.\r
\r
An overlap query (enclosure query) takes three inputs: a query ball $B$, a minimum level $k_{\\rm min}$, and a boolean flag \`group_by_level\`.\r
\r
The output is every region in the tree that overlaps (encloses) $B$ and whose level is at least $k_{\\rm min}$. If \`group_by_level = true\`, the result is returned as a map from level to a list of matching regions.\r
\r
The query traverses the tree top-down, starting from the root's children. For each visited region, test for overlap (enclosure) with $B$. If the region overlaps (encloses) $B$ and its level is at least $k_{\\rm min}$, include it in the output. Recurse only into children that overlap (enclose) $B$. If a region's level is less than $k_{\\rm min}$, it is not reported and its subtree is not traversed.\r
\r
*Note: Overlap and enclosure queries return regions, not objects.*\r
\r
### Insertion\r
\r
To insert an object $O = B(c,r)$:\r
\r
1. If $r+\\rho \\ge S^{k_{\\rm max}}$, store $O$ directly under the root and terminate.\r
2. Otherwise, compute its admissible level $k$.\r
3. Perform an enclosure query with query ball $O$, minimum level $k$, and \`group_by_level = true\`.\r
4. **Existing region:** Search the returned regions at level $k$ for any that enclose $O$. If one or more exist, select the region whose center is closest to $c$ and store $O$ there. If that region was previously unpopulated, populate it. Terminate.\r
5. **Create new region:** If no suitable level-$k$ region exists, create a new region $R_k = B(c,S^k)$. Store $O$ in $R_k$, populate $R_k$, and connect it upward.\r
6. **Connect upward:** Initially let $j := k$. Search the query results at level $j+1$ for a region that encloses $R_j$.\r
   * If one exists, select the one whose center is closest to $c$, assign it as the parent of $R_j$, and terminate.\r
   * If none exist and $j+1 \\le k_{\\rm max}$, create a new region $R_{j+1} = B(c,S^{j+1})$, make $R_j$ its child, set $j := j+1$, and connect $R_j$ upward.\r
   * If $j = k_{\\rm max}$ is reached without finding a parent, add $R_{k_{\\rm max}}$ to the children of the root.\r
\r
This procedure always reuses an existing valid region when possible and otherwise creates the shortest necessary chain of new ancestors.\r
\r
### Deletion\r
\r
To delete an object $O$:\r
\r
1. Remove $O$ from its parent node.\r
2. If the node is a region and this removal transitions it to unpopulated, unpopulate it.\r
3. If the node is now empty (no stored objects and no child regions), remove it from its parent.\r
4. Apply the emptiness test iteratively to the parent, removing empty ancestors until a non-empty region or the root is reached.\r
\r
### Updating after object movement\r
\r
Suppose that object $O$ has moved to a new center while keeping the same radius. Let $H$ be its current parent node.\r
\r
1. If $H$ is the root, or if $O$ is still enclosed in $H$, no structural changes are required. Terminate.\r
2. Otherwise, remove $O$ from $H$. If $H$ transitions to unpopulated, unpopulate it.\r
3. Insert $O$ back into the tree using the insertion procedure.\r
4. Clean up the old path: if $H$ is now empty, remove it from its parent. Apply this iteratively upward, deleting empty ancestors until a non-empty region or the root is reached.\r
\r
*Note: Reinsertion strictly precedes pruning so that any valid ancestors of $H$ remain available for reuse during the insertion phase.*\r
\r
## Collision detection\r
\r
The tree accelerates broad-phase collision detection by exploiting the neighbor lists of populated regions. Objects stored under the root are compared separately.\r
\r
1. Test every pair of objects stored directly under the root.\r
2. For each root object, test it against every object stored directly in any populated region that overlaps it.\r
3. For every populated region:\r
   * Test every pair of objects stored in that region.\r
   * For every neighboring populated region, test every object stored directly in one region against every object stored directly in the other.\r
\r
Since neighbor lists are symmetric, each pair of neighboring regions must be processed only once.\r
\r
Each candidate pair is then subjected to an exact overlap test between the two objects. The procedure reports every overlapping pair exactly once.\r
\r
## Notes\r
\r
The object radius and margin are assumed to remain fixed, so the admissible level of an object does not need to be recomputed. The update operation is a localized relocation: preserve the current parent node when possible, otherwise move the object to an existing region or create only the minimum new structure needed to restore the invariants.\r
\r
Neighbor lists depend only on populated regions. They are unaffected by changes to the tree topology and are updated only when a region transitions between populated and unpopulated.\r
\r
## Lazy variant\r
\r
The lazy variant of the algorithm separates regions into internal regions and leaves. An internal region is like the regions described previously: it can have child regions and it can store enclosed objects whose admissible level matches the level of the region. A leaf region has no child regions, but in addition to enclosed admissible-level objects, it can also store deferred objects that are enclosed objects whose admissible level is strictly lower than the region level. \r
\r
We do not use neighbor lists or track populated regions. Collision detection is done with a recursive dual-tree traversal that prunes ball pairs whenever they do not overlap.\r
\r
Insertion tracks enclosing regions from level $\\text{maxLevel}$ down to $\\text{lvl}(O)$. At level $k$, it searches for a child region enclosing a ball centered at $x_O$ with test radius $r_{\\text{test}}$, where $r_{\\text{test}} = S^{k-1}$ for $k > \\text{lvl}(O)$ (ensuring space for a potential sub-region) and $r_{\\text{test}} = r_O$ at the native level $k = \\text{lvl}(O)$. If a matching region is found, $O$ is stored there if it is a leaf or at native level and for a non-native internal region traversal continues through it as the updated parent anchor. If no matching region exists, insertion terminates by creating a new leaf centered at $x_O$ under the level-$(k+1)$ parent anchor.\r
\r
We define\r
\r
$$\r
n(R) = \\#\\{O:\\text{$O$ is object stored in the subtree of $R$}\\},\r
$$\r
\r
$$\r
w(R) = n(R)\\sum_{\\stackrel{\\tiny \\text{$Q$ overlaps $R$}}{\\tiny \\text{lvl}(R)=\\text{lvl}(Q)}}n(Q)\r
$$\r
\r
and we split a leaf region $R$ if $w(R)>T_{\\text{split}}$ and collapse an internal region if $w(R)<T_{\\text{collapse}}$. Collapsing an internal node converts it to a leaf, removing all structure in its subtree and converting all objects from the subtree into deferred objects within the leaf. Splitting a leaf converts it into an internal node and all the deferred objects in the leaf are re-inserted into the tree. These operations are not inverses to each other since re-insertion during split may not be possible under the original leaf and the objects can land elsewhere in the tree. Evaluating $w(R)$, splitting, and collapsing are only done once per frame during the collision detection recursion. Using $w(R)$ (or a measure like it) with thresholds serves as a heuristic for tree rebalancing.\r
\r
There are also other small differences to the original algorithm that we do not go into. The lazy variant produces much smaller tree structures and avoids long chains of regions just to store one small isolated object. It might be more efficient if the objects move significantly between frames.\r
\r
## Bounding occupancy\r
\r
**Theorem (Region separation)**  \r
Assume there exists a constant $C>0$ such that every object satisfies $\\rho\\ge Cr$. Let\r
\r
$$\r
\\alpha=\\min\\!\\left\\{1-\\frac1S,\\frac{C}{1+C}\\right\\}.\r
$$\r
\r
Then the centers of all level-$k$ regions are $\\alpha S^k$-separated.\r
\r
**Proof**  \r
Let $B=B(b,S^k)$ and $B'=B(b',S^k)$ be two distinct level-$k$ regions. Assume $B$ was created after $B'$.\r
\r
When $B$ was created, it was initialized with a single child object or child region $D$, whose center became the center of $B$. Thus $b$ is the center of $D$. Since $B'$ already existed and was not selected as the parent of $D$, the region $B'$ did not enclose $D$.\r
\r
If $D$ is a level-$(k-1)$ region, then $D=B(b,S^{k-1})$, so\r
\r
$$\r
d(b,b')+S^{k-1}>S^k,\r
$$\r
\r
which implies\r
\r
$$\r
d(b,b')>\\left(1-\\frac1S\\right)S^k\\ge\\alpha S^k.\r
$$\r
\r
If instead $D$ is an object of radius $r$, then\r
\r
$$\r
d(b,b')+r>S^k.\r
$$\r
\r
Since the object is admissible at level $k$, $r+\\rho<S^k$. Together with the assumption $\\rho\\ge Cr$, this gives\r
\r
$$\r
(1+C)r\\le r+\\rho<S^k,\r
$$\r
\r
and therefore $r<S^k/(1+C)$.\r
\r
Substituting into the previous inequality yields\r
\r
$$\r
d(b,b')>S^k-r>S^k-\\frac{S^k}{1+C}=\\frac{C}{1+C}S^k\\ge\\alpha S^k.\r
$$\r
\r
Thus in either case, $d(b,b')>\\alpha S^k$. $\\square$\r
\r
**Corollary (Bounded number of children)**  \r
Assume $(X,d)$ is a doubling metric space with doubling dimension $d$. Assume further that there exists a constant $C>0$ such that every object satisfies $\\rho\\ge Cr$. Then every level-$(k+1)$ region has at most\r
\r
$$\r
N=O\\!\\left(\\left(\\frac{S-1}{\\alpha}\\right)^d\\right)\r
$$\r
\r
level-$k$ children, where\r
\r
$$\r
\\alpha=\\min\\!\\left\\{1-\\frac1S,\\frac{C}{1+C}\\right\\}.\r
$$\r
\r
In particular, the number of children of a region is bounded by a constant depending only on $S$, $C$, and the doubling dimension of $(X,d)$.\r
\r
**Proof**  \r
By the previous lemma, the centers of the level-$k$ children are $\\alpha S^k$-separated. Since every child region is enclosed by its parent, all child centers lie within distance $S^{k+1}-S^k=(S-1)S^k$ of the parent center. A standard packing bound for doubling metric spaces therefore implies that the number of such centers is at most\r
\r
$$\r
O\\!\\left(\\left(\\frac{(S-1)S^k}{\\alpha S^k}\\right)^d\\right) = O\\!\\left(\\left(\\frac{S-1}{\\alpha}\\right)^d\\right).\r
$$\r
\r
This bound is independent of $k$. $\\square$`,A=`## Mathematical model for updates with one object\r
\r
We want to analyze the rebuild process of the algorithm when there is only one object. We simplify the object to a point and generalize the region radii from $S^k$ to an arbitrary strictly increasing sequence. This gives an independent mathematical model based on the update procedure.\r
\r
Let $(X,d)$ be a metric space and let\r
\r
$$\r
0<r_0<r_1<r_2<\\cdots\r
$$\r
\r
be a strictly increasing sequence of radii. Define corresponding differences by\r
\r
$$\r
\\Delta_0=r_0,\r
\\qquad\r
\\Delta_k=r_k-r_{k-1},\r
\\quad k\\ge 1.\r
$$\r
\r
For technical reasons (rebuild cascade termination), we also require that $(\\Delta_k)$ is not bounded.\r
\r
A point moves along an arc-length parametrized path\r
\r
$$\r
\\gamma:[0,\\infty)\\to X.\r
$$\r
\r
For each level $k\\ge0$, let $c_k=c_k(t)$ denote the center of the level-$k$ ball at time $t$. Initially, all centers coincide with the initial position of the point:\r
\r
$$\r
c_0(0)=c_1(0)=c_2(0)=\\cdots=\\gamma(0).\r
$$\r
\r
At level $k$, the associated ball is\r
\r
$$\r
B(c_k,r_k).\r
$$\r
\r
For $k\\ge1$, the level-$k$ ball encloses the level-$(k-1)$ ball if and only if\r
\r
$$\r
d(c_k,c_{k-1})+r_{k-1}\\le r_k,\r
$$\r
\r
or equivalently,\r
\r
$$\r
d(c_k,c_{k-1})\\le\\Delta_k.\r
$$\r
\r
Level $0$ rebuilds whenever the moving point reaches distance $r_0$ from its current center, i.e. when the point is no longer contained in the level $0$ ball. At such a rebuild, $c_0$ is reset to the current position of the point. For each $k\\ge1$, level $k$ rebuilds when a level-$(k-1)$ rebuild causes the level-$k$ ball to cease enclosing the level-$(k-1)$ ball. At such a rebuild, $c_k$ is reset to the new value of $c_{k-1}$.\r
\r
Rebuilds are processed from lower levels to higher levels. When a level-$(k−1)$ rebuild changes $c_{k−1}$, the new enclosure condition between levels $k−1$ and $k$ is immediately tested. If it fails, level $k$ rebuilds and $c_k$ is reset to the new $c_{k−1}$; this may in turn trigger a rebuild at level $k+1$, and so on. Because $\\gamma$ is arc-length parametrized, $d(c_k, c_{k-1}) \\le t$ at time $t$. Since $(\\Delta_k)$ is unbounded, $\\Delta_k\\ge t$ for some $k=k_0$, guaranteeing that the enclosure condition holds at level $k_0$ and the cascade terminates after finitely many levels.\r
\r
For every level $k\\ge 0$, we regard the initial configuration at time $t=0$ as the first level-$k$ rebuild. For each level $k$, let\r
\r
$$\r
t_{k,0}=0<t_{k,1}<t_{k,2}<\\cdots\r
$$\r
\r
denote the successive level-$k$ rebuild times whenever these times exist.\r
\r
**Lemma (Rebuild displacement bound)**  \r
Let \r
\r
$$\r
a=c_k(t_{k,i}),\r
\\qquad\r
b=c_k(t_{k,i+1})\r
$$\r
\r
be two consecutive rebuild positions at level $k\\ge 1$. Then\r
\r
$$\r
\\Delta_k<d(a,b)\\le r_k.\r
$$\r
\r
**Proof**  \r
For the lower bound, immediately after the rebuild at $a$, the level-$(k-1)$ center coincides with $a$. The level-$k$ ball continues to enclose the level-$(k-1)$ ball precisely while\r
\r
$$\r
d(a,c_{k-1})\\le\\Delta_k.\r
$$\r
\r
The rebuild at $b$ occurs at the first level-$(k-1)$ rebuild for which this condition fails. Since equality still satisfies the enclosure condition, we have\r
\r
$$\r
d(a,b)>\\Delta_k.\r
$$\r
\r
For the upper bound, let $T=t_{k,i+1}$ be the time of the rebuild at $b$. Before time $T$, the level-$k$ ball still has center $a$, and the point remains enclosed by this ball. Hence\r
\r
$$\r
d(\\gamma(t),a)<r_k\r
$$\r
\r
for $t<T$. At time $T$, the new level-$k$ center is the current position of the point, so $b=\\gamma(T)$.\r
\r
Since $\\gamma$ is continuous,\r
\r
$$\r
d(a,b)\r
=\r
\r
\\lim_{t\\to T^-}d(a,\\gamma(t))\r
\\le r_k.\r
$$\r
$\\square$\r
\r
## Dynamics of minimizing geodesics\r
\r
In this section we assume that $\\gamma$ is a unit-speed minimizing geodesic. The following lemma shows that, at every level, all intervals between successive rebuilds have the same length, and gives an explicit recurrence for these lengths.\r
\r
**Lemma (Dynamics of minimizing geodesics)**  \r
Suppose that $\\gamma$ is a unit-speed minimizing geodesic. For every $k$, every interval between successive level-$k$ rebuilds has the same length $L_k$. It is uniquely determined by\r
\r
$$\r
L_0=r_0, \\quad\r
C_k=\r
\\left\\lfloor\r
\\frac{\\Delta_k}{L_{k-1}}\r
\\right\\rfloor+1, \\quad \r
L_k=C_kL_{k-1}.\r
$$\r
\r
**Proof**  \r
Let $L_k$ denote the interval between the first and second level-$k$ rebuilds. We use induction to prove that every level-$k$ interval has length $L_k$.\r
\r
For level $0$, the point moves at unit speed and a rebuild occurs whenever it has traveled distance $r_0$ from the current center. Hence $L_0=r_0$, and every level-$0$ rebuild interval has length $L_0$.\r
\r
Now suppose $k\\ge1$, and assume every level-$(k-1)$ rebuild interval has length $L_{k-1}$.\r
\r
Immediately after the first level-$k$ rebuild, the centers of all levels up to $k$ coincide:\r
$$\r
c_0=c_1=\\cdots=c_k.\r
$$\r
\r
By the induction hypothesis, consecutive level-$(k-1)$ rebuilds occur $L_{k-1}$ units of time apart. Since $\\gamma$ is unit-speed, the point travels exactly $L_{k-1}$ units of arc length between consecutive level-$(k-1)$ rebuilds. Because $\\gamma$ is also minimizing, this arc length equals the metric distance between the corresponding positions. Thus each successive level-$(k-1)$ rebuild moves $c_{k-1}$ a distance exactly $L_{k-1}$ along $\\gamma$.\r
\r
Consequently, after $m$ level-$(k-1)$ rebuilds following the level-$k$ rebuild, the level-$(k-1)$ center has moved a distance\r
$$\r
d(c_{k-1},c_k)=mL_{k-1}\r
$$\r
from the fixed level-$k$ center.\r
\r
The level-$k$ region continues to enclose the level-$(k-1)$ region precisely while\r
$$\r
mL_{k-1}\\le \\Delta_k.\r
$$\r
\r
Therefore the largest number of level-$(k-1)$ rebuilds that can occur while the level-$k$ region remains enclosing is\r
$$\r
\\left\\lfloor\\frac{\\Delta_k}{L_{k-1}}\\right\\rfloor.\r
$$\r
\r
The next level-$k$ rebuild therefore occurs after\r
$$\r
C_k=\r
\\left\\lfloor\\frac{\\Delta_k}{L_{k-1}}\\right\\rfloor+1\r
$$\r
level-$(k-1)$ rebuilds, giving\r
$$\r
L_k=C_kL_{k-1}.\r
$$\r
\r
Finally, after every level-$k$ rebuild,\r
\r
$$\r
c_0=c_1=\\cdots=c_k.\r
$$\r
\r
Thus the configuration of the centers is identical to the initial configuration, except translated along the minimizing geodesic. Since the dynamics depend only on the relative positions of the centers, the subsequent evolution is identical after every level-$k$ rebuild. Therefore every interval between successive level-$k$ rebuilds has length $L_k$. $\\square$\r
\r
**Lemma**  \r
Suppose that $r_k=S^k$ for every $k$. Then \r
\r
$$\r
C_k\\in\\bigl\\{\\left\\lfloor{S}\\right\\rfloor,\\left\\lceil{S}\\right\\rceil\\bigr\\}.\r
$$\r
\r
for every $k\\ge 1$. In particular, if further $S=n>1$ is an integer, then $C_k=n$ and $L_k=n^k$ for every $k\\ge 1$.\r
\r
**Proof**  \r
Denote $x = (S^k - S^{k-1})/L_{k-1}$. The rebuild displacement bounds $S^{k-1} - S^{k-2} < L_{k-1} \\le S^{k-1}$ yield \r
\r
$$\r
S - 1 \\le x < S.\r
$$\r
\r
Taking the floor of the lower bound gives $\\lfloor S \\rfloor - 1 \\le \\lfloor x \\rfloor$. For the upper bound, $x < S \\le \\lceil S \\rceil$ implies the strict inequality $\\lfloor x \\rfloor < \\lceil S \\rceil$, which reduces to $\\lfloor x \\rfloor \\le \\lceil S \\rceil - 1$ as both sides are integers. Combining these yields\r
\r
\r
$$\r
\\lfloor S \\rfloor - 1 \r
\\le \r
\\lfloor x \\rfloor \r
\\le \r
\\lceil S \\rceil - 1.\r
$$\r
\r
\r
Since $C_k = \\lfloor x \\rfloor + 1$, it follows that $\\lfloor S \\rfloor \\le C_k \\le \\lceil S \\rceil$.\r
\r
The claim concerning integers $S$ immediately follows.\r
$\\square$\r
\r
The table below lists some values of $(C_k)$ and $(L_k/S^k)$ for different values of $S$. \r
\r
$$\r
\\begin{array}{c||c|cccccccccccc}\r
S & k & 0 & 1 & 2 & 3 & 4 & 5 & 6 & 7 & 8 & 9 & 10 & 11 & 12 \\\\\r
\\hline\r
3/2 & C_k &  & 1 & 1 & 2 & 1 & 2 & 1 & 2 & 2 & 1 & 2 & 1 & 2 \\\\\r
& L_k/S^k & 1 & 0.67 & 0.44 & 0.59 & 0.40 & 0.53 & 0.35 & 0.47 & 0.62 & 0.42 & 0.55 & 0.37 & 0.49 \\\\\r
\\hline\r
2 & C_k &  & 2 & 2 & 2 & 2 & 2 & 2 & 2 & 2 & 2 & 2 & 2 & 2 \\\\\r
& L_k/S^k & 1 & 1 & 1 & 1 & 1 & 1 & 1 & 1 & 1 & 1 & 1 & 1 & 1 \\\\\r
\\hline\r
5/2 & C_k &  & 2 & 2 & 3 & 2 & 3 & 3 & 2 & 3 & 2 & 3 & 2 & 3 \\\\\r
& L_k/S^k & 1 & 0.8 & 0.64 & 0.77 & 0.61 & 0.74 & 0.88 & 0.71 & 0.85 & 0.68 & 0.82 & 0.65 & 0.78 \\\\\r
\\end{array}\r
\\\\[4pt]\r
\\text{Sequences for $S=3/2,2,5/2$. Terms that do not have two decimal digits are exact.}\r
$$\r
\r
### Total rebuild rate\r
\r
The rebuild frequency of level $k$ is $1/L_k$, since one rebuild occurs every $L_k$ units of travel.\r
\r
The total rebuild frequency of the hierarchy is therefore\r
\r
$$\r
R=\\sum_{k=0}^{\\infty}\\frac{1}{L_k}.\r
$$\r
\r
Here $R$ represents the total asymptotic frequency of rebuild events across all levels, and serves as a simple mathematical proxy for the amount of tree-maintenance work in the algorithm caused by the object's motion. Each rebuild at each level counts as a separate event. Thus, if one level-0 rebuild triggers a cascade through several higher levels, every rebuild in the cascade contributes separately to R.\r
\r
### Bounding total rebuild rate\r
\r
The displacement bound gives, for two consecutive rebuild positions at level $k$,\r
\r
$$\r
\\Delta_k<d(a,b)\\le r_k.\r
$$\r
\r
In the minimizing geodesic case, the path is unit-speed, so the distance between consecutive level-$k$ rebuild positions is exactly the time between them. Thus\r
\r
$$\r
\\Delta_k<L_k\\le r_k.\r
$$\r
\r
This leads us to define lower and upper total rebuild rates\r
\r
$$\r
R_{\\mathrm{ideal}}\r
=\r
\\sum_{k=0}^{\\infty}\\frac{1}{r_k},\r
\\qquad\r
R_{\\mathrm{upper}}\r
=\r
\\sum_{k=0}^{\\infty}\\frac{1}{\\Delta_k}\r
$$\r
\r
and the corresponding bounds are\r
\r
$$\r
R_{\\mathrm{ideal}}\\le R < R_{\\mathrm{upper}}\r
$$\r
\r
assuming $R_{\\text{upper}}<\\infty$. Note that then $R=R_{\\text{ideal}}$ if and only if $L_k=r_k$ for every $k$.\r
\r
## Rebuild rates for $r_k=S^k$\r
\r
Suppose that $r_k=S^k$ for some $S>1$. Then the ideal and upper total rebuild rates involve geometric series and evaluate to\r
\r
$$\r
\\frac{S}{S-1}\r
=\r
R_{\\mathrm{ideal}}\r
\\le R<\r
R_{\\mathrm{upper}}\r
=\r
\\frac{S^2-S+1}{(S-1)^2}.\r
$$\r
\r
We know that if $S=n$ is an integer, then $L_k=n^k$ for every $k$, so that $R=R_{\\text{ideal}}$ and the lower bound is realized. Below we show that the upper bound is also realized as limits $S\\to n^-$ for integer $n>1$.\r
\r
**Lemma**  \r
Let $n>1$ be an integer. For every fixed $k\\ge1$, there exists $\\delta_k>0$ such that\r
\r
$$\r
L_k=(n-1)n^{k-1}\r
$$\r
\r
for all $S\\in(n-\\delta_k,n)$.\r
\r
**Proof**  \r
We proceed by induction on $k$. For $k=1$,\r
\r
$$\r
L_1=\\lfloor S\\rfloor=n-1\r
$$\r
\r
throughout $S\\in(n-1,n)$.\r
\r
Suppose the claim holds at level $k-1$. Then, sufficiently close to $n$,\r
\r
$$\r
C_k\r
=\r
\r
\\left\\lfloor\r
\\frac{S^k-S^{k-1}}{(n-1)n^{k-2}}\r
\\right\\rfloor+1.\r
$$\r
\r
The expression inside the floor is strictly increasing in $S$ and equals $n$ at $S=n$. It is therefore less than $n$ for $S<n$ and greater than $n-1$ for $S$ sufficiently close to $n$. Hence $C_k=n$ sufficiently close to $n$, and\r
\r
$$\r
L_k=nL_{k-1}=(n-1)n^{k-1}.\r
$$\r
\r
This completes the induction. $\\square$\r
\r
**Proposition**  \r
For every integer $n>1$,\r
\r
$$\r
\\lim_{S\\to n^-}R(S)\r
=\r
R_{\\text{upper}}(n).\r
$$\r
\r
**Proof**  \r
By the lemma, for every fixed $k$,\r
\r
$$\r
\\lim_{S\\to n^-}\\frac{1}{L_k(S)}\r
=\r
\r
\\frac{1}{(n-1)n^{k-1}}.\r
$$\r
\r
Furthermore, for $S$ sufficiently close to $n$,\r
\r
$$\r
\\frac{1}{L_k(S)}\r
<\r
\\frac{1}{S^{k-1}(S-1)},\r
$$\r
\r
and the right-hand side is uniformly bounded near $n$ by a summable geometric sequence. Thus the limit may be taken termwise in the rebuild-rate series, giving\r
\r
$$\r
\\lim_{S\\to n^-}R(S)\r
=\r
1+\\sum_{k=1}^{\\infty}\\frac{1}{(n-1)n^{k-1}}\r
=\r
\\frac{n^2-n+1}{(n-1)^2}\r
=\r
R_{\\text{upper}}(n).\r
$$\r
$\\square$\r
\r
In the graph below we plot $R$ as function of $S$, normalized so that $y=0$ corresponds to $R_\\text{ideal}$ and $y=1$ corresponds to $R_\\text{upper}$. Specifically, the plot shows\r
\r
$$\r
\\frac{R(S)-R_\\text{ideal}(S)}{R_\\text{upper}(S)-R_\\text{ideal}(S)}.\r
$$\r
\r
It demonstrates the jumps from $R\\approx R_{\\text{upper}}$ just before an integer to $R=R_{\\text{ideal}}$ at the integer value. \r
\r
<figure>\r
\r
![Rebuild rate as function of $S$](./eta.png)\r
\r
</figure>\r
\r
## Non-geodesic paths\r
\r
Suppose that $\\gamma$ is an arc-length parametrized path, but not necessarily a minimizing geodesic. We can no longer write explicit formulas for the rebuild times or obtain a periodic rebuild schedule. However, the rebuild displacement bound remains valid: if $a$ and $b$ are two consecutive rebuild positions at level $k$, then\r
\r
$$\r
\\Delta_k<d(a,b)\\le r_k.\r
$$\r
\r
Since the distance between two points is at most the length of the path segment connecting them, consecutive level-$k$ rebuilds must be separated by more than $\\Delta_k$ units of travel.\r
\r
For each level $k$, let\r
\r
$$\r
m_k(t)=\\#\\{i:0 < t_{k,i}\\le t\\}\r
$$\r
\r
denote the number of level-$k$ rebuilds up to time $t>0$, excluding the initial rebuild. Define the total number of rebuild events across all levels up time $T$ as\r
\r
$$\r
M(t) = \\sum_{k=0}^\\infty m_k(t).\r
$$\r
\r
Then we define upper asymptotic rebuild rate by\r
\r
$$\r
R^+\r
=\r
R^+(\\gamma)\r
=\r
\\limsup_{t\\to\\infty}\\frac{M(t)}{t}.\r
$$\r
\r
**Proposition**  \r
The upper asymptotic rebuild rate satisfies\r
\r
$$\r
R^+\r
\\le\r
R_{\\text{upper}}.\r
$$\r
\r
In particular, if $S>1$ and $(r_k)=(S^k)$, then\r
\r
$$\r
R^+\r
\\le\r
\\frac{S^2-S+1}{(S-1)^2}.\r
$$\r
\r
**Proof**  \r
There are $m_k(t)$ non-initial level-$k$ rebuilds by time $t>0$. Each is separated from its preceding level-$k$ rebuild by more than $\\Delta_k$ units of travel. Thus\r
\r
$$\r
t > m_k(t)\\Delta_k\r
$$\r
\r
for every $k\\ge 0$ and every $t>0$. From this obtain\r
\r
$$\r
R^+\r
=\r
\\limsup_{t\\to\\infty}\\lim_{j\\to\\infty}\\sum_{k=0}^j\\frac{m_k(t)}{t}\r
\\le\r
\\limsup_{t\\to\\infty}\\lim_{j\\to\\infty}\\sum_{k=0}^j\\frac{1}{\\Delta_k}\r
=\r
\\sum_{k=0}^\\infty\\frac{1}{\\Delta_k}\r
=\r
R_{\\text{upper}}.\r
$$\r
\r
$\\square$\r
\r
If $S=n>1$ is an integer, and $r_k=S^k$, then it can be shown that a minimizing geodesic maximizes the upper asymptotic rebuild rate.\r
\r
A minimizing geodesic is a natural candidate for maximizing the upper asymptotic rebuild rate because it does this if $S$ is integer, and regardless of $S$ it follows a greedy strategy: after each rebuild, it moves directly toward the nearest point at which the next rebuild can occur. This makes each individual rebuild occur as early as possible, but, as the construction below shows, this local strategy need not maximize the upper asymptotic rebuild rate. \r
\r
### Example: minimizing geodesics do not always maximize upper asymptotic rebuild rate\r
\r
We construct a path in $\\R^2$ that mostly follows a geodesic but with an initial (and periodically repeated) perturbation that changes the phase of the rebuild schedule so that, through level $4$, the path $\\gamma$ has exactly the same rebuild-rate contribution as the geodesic,\r
\r
$$\r
1+\\frac13+\\frac{11}{135}+\\frac{3}{135}+\\frac{1}{135}\r
=\r
1+\\frac13+\\frac1{12}+\\frac1{48}+\\frac1{144}.\r
$$\r
\r
However, the level-$4$ rebuild of $\\gamma$ is reached after a net advance of only\r
\r
$$\r
\\Delta_2+123\\approx 132.83,\r
$$\r
\r
whereas the corresponding geodesic advance is $144$. Thus $\\gamma$ reaches the same level $0$ to $4$ rebuild rate using a smaller advance. This difference propagates to the higher levels and eventually gives $\\gamma$ a strictly larger upper asymptotic rebuild rate.\r
\r
##### Construction\r
\r
Fix $S=147/40=3.675$ and let $(r_k)=(S^k)$. We construct a path $\\gamma:[0,\\infty)\\to\\R^2$ satisfying\r
\r
$$\r
R^+(\\gamma)>R(S).\r
$$\r
\r
Let $\\theta\\in(0,\\pi/2)$ be the unique angle satisfying\r
\r
$$\r
6\\cos\\theta=\\Delta_2-6\\approx 3.83.\r
$$\r
\r
Denote\r
\r
$$\r
A=\\Delta_2+123\\approx 132.83.\r
$$\r
\r
Let $\\gamma_4 : [0, 135] \\to \\mathbb{R}^2$ be the unit-speed, piecewise linear path connecting these vertices in sequence:\r
\r
$$\r
\\begin{aligned}\r
(0,0) \r
&\\to (3\\cos\\theta, 3\\sin\\theta) \\\\\r
&\\to (6\\cos\\theta, 0) = (\\Delta_2 - 6, 0) \\\\\r
&\\to (A, 0).\r
\\end{aligned}\r
$$\r
\r
Define $\\gamma:[0,\\infty)\\to\\R^2$ by \r
\r
$$\r
\\gamma(t)\r
=\r
\\gamma_4\\bigl(t - 135\\lfloor t/135 \\rfloor\\bigr) \r
+ \\lfloor t/135 \\rfloor \\bigl(\\gamma_4(135) - \\gamma_4(0)\\bigr).\r
$$\r
\r
That is, $\\gamma$ repeats $\\gamma_4$ indefinitely, translating each copy by \r
\r
$$\r
\\gamma_4(135)-\\gamma_4(0)\r
=\r
(A,0)\r
$$\r
\r
so that the resulting path is continuous. Since each copy is unit-speed and the translations do not affect speed, $\\gamma$ is also unit speed. \r
\r
##### Rebuilds up to level $4$\r
\r
Let's begin by examining the rebuild events of $\\gamma$ on the interval $(0,135]$. We exclude $0$ so that initial builds are not counted but include the endpoint $135$ so that any rebuild exactly at $135$ is included.\r
\r
Level-$0$ rebuilds happen exactly at each $t\\in\\{1,2,3,\\ldots,135\\}$.\r
\r
Level-$1$ rebuilds happen exactly at each $t\\in\\{3,6,9,\\ldots,135\\}$.\r
\r
For level-$2$ the rebuild threshold is $\\Delta_2\\approx 9.83$. At the fourth level-$1$ rebuild at $t=12$ we have $\\gamma(12)=(\\Delta_2,0)$ so that we are exactly on the threshold and this does not cause a level-$2$ rebuild. Therefore the fifth level-$1$ rebuild at $\\gamma(15)=(\\Delta_2+3,0)$ causes the first level-$2$ rebuild. See image below but note that it includes initial builds at $t=0$.\r
\r
![Counter-example image](./counter_example.png)\r
\r
After $t=15$ the path follows a straight line and the subsequent level-$2$ rebuilds happen with intervals of $L_2=12$. This means that the level-$2$ rebuilds happen exactly at $t=15+12m$, $m\\in\\{0,1,\\ldots,10\\}$.\r
\r
For level-$3$ the rebuild threshold is $\\Delta_3\\approx 36.13$. At the third level-$2$ rebuild at $t=39$ we have $\\gamma(39)=(\\Delta_2+27,0)\\approx(36.83,0)$. This is just over the threshold so that the first level-$3$ rebuild happens at $t=39$.\r
\r
After $t=39$ the path follows a straight line and the subsequent level-$3$ rebuilds happen with intervals $L_3=48$. This means that the level-$3$ rebuilds happen exactly at $t\\in\\{39,87,135\\}$.\r
\r
For level-$4$ the rebuild threshold is $\\Delta_4\\approx 132.77$. At the third level-$3$ rebuild at $t=135$ we have $\\gamma(135)=(A,0)\\approx(132.83,0)$. This is just over the threshold so that the first level-$4$ rebuild happens at $t=135$.\r
\r
These are all the rebuild events that happen for $\\gamma$ on the interval $(0,135]$. There are a total of $195$ rebuild events on the interval as the following table shows.\r
\r
$$\r
\\begin{array}{c|c}\r
\\text{Level} & \\text{Count} \\\\\r
\\hline\r
0 & 135 \\\\\r
1 & 45 \\\\\r
2 & 11 \\\\\r
3 & 3 \\\\\r
4 & 1 \\\\\r
\\end{array}\r
$$\r
\r
#####  Higher-level rebuilds\r
\r
Let's look at higher level rebuilds for $\\gamma$. This is simple since the path just advances by $(A,0)$ between each level-$4$ rebuild.\r
\r
For level-$5$ we have $\\Delta_5\\approx 487.93$. The number of level-$4$ rebuild intervals between two subsequent level-$5$ rebuilds is\r
\r
$$\r
\\Bigl\\lfloor\\frac{\\Delta_5}{A}\\Bigr\\rfloor+1=4\r
$$\r
\r
and the advance in the $e_1$ direction between level-$5$ rebuilds is $4A$. \r
\r
Similarly, for level-$6$ we have $\\Delta_6\\approx 1793.12$. The number of level-$5$ rebuild intervals between two subsequent level-$6$ rebuilds is \r
\r
$$\r
\\Bigl\\lfloor\\frac{\\Delta_6}{4A}\\Bigr\\rfloor+1=4\r
$$\r
\r
and the advance in the $e_1$ direction between level-$6$ rebuilds is $16A$.\r
\r
Finally, for level-$7$ we have $\\Delta_7\\approx 6589.73$. The number of level-$6$ rebuild intervals between two subsequent level-$7$ rebuilds is \r
\r
$$\r
\\Bigl\\lfloor\\frac{\\Delta_7}{16A}\\Bigr\\rfloor+1=4.\r
$$\r
\r
Thus there are $4\\cdot 4\\cdot 4=64$ level-$4$ rebuilds between two subsequent level-$7$ rebuilds. The table below counts all the rebuilds on the interval $(0,64\\cdot 135]$.\r
\r
$$\r
\\begin{array}{c|c}\r
\\text{Level} & \\text{Count} \\\\\r
\\hline\r
0 & 64\\cdot 135 \\\\\r
1 & 64\\cdot 45 \\\\\r
2 & 64\\cdot 11 \\\\\r
3 & 64\\cdot 3 \\\\\r
4 & 64 \\\\\r
5 & 16 \\\\\r
6 & 4 \\\\\r
7 & 1 \\\\\r
\\hline\r
\\text{Sum} & 12501\r
\\end{array}\r
$$\r
\r
Since the path is translated by the same vector after each interval of length $135$, and a level-$7$ rebuild occurs every $64$ such intervals, the entire rebuild pattern through level $7$ repeats, up to translation, on every subsequent interval of length $64\\cdot 135$. Therefore \r
\r
$$\r
R^+(\\gamma)\\ge\\frac{12501}{64\\cdot 135}=\\frac{100008}{69120}.\r
$$\r
\r
##### Comparison with the geodesic\r
\r
What about the geodesic rebuild rate? The geodesic construction gives the following values for $C_k$ and $L_k$ for $k\\le 6$.\r
\r
$$\r
\\begin{array}{c||c|c|c|c|c|c|c}\r
k & 0 & 1 & 2 & 3 & 4 & 5 & 6 \\\\\r
\\hline\r
C_k & & 3 & 4 & 4 & 3 & 4 & 4  \\\\\r
L_k & 1 & 3 & 12 & 48 & 144 & 576 & 2304 \\\\\r
\\end{array}\r
$$\r
\r
For the remaining terms we can use $C_k\\ge\\lfloor S\\rfloor=3$ to get $L_k\\ge 3^{k-6}L_6$ for every $k\\ge 6$, and thus\r
\r
$$\r
\\begin{aligned}\r
R(S)\r
&=\r
\\sum_{k=0}^\\infty \\frac{1}{L_k}\r
=\\frac{833}{576}+\\sum_{k=6}^\\infty \\frac{1}{L_k} \\\\\r
&\\le\r
\\frac{833}{576} + \\sum_{k=6}^\\infty \\frac{1}{3^{k-6}L_6}\r
=\r
\\frac{833}{576} + \\frac{1}{L_6}\\sum_{k=0}^\\infty \\frac{1}{3^k} \\\\\r
&=\r
\\frac{833}{576} + \\frac{3}{2L_6} \r
=\r
\\frac{6667}{4608}=\\frac{100005}{69120}.\r
\\end{aligned}\r
$$\r
\r
Combining the bounds we get\r
\r
$$\r
R^+(\\gamma)\\ge \\frac{100008}{69120} > \\frac{100005}{69120}\\ge R(S).\r
$$\r
\r
The preceding estimates only use enough terms to prove the strict inequality. The actual gap is larger and the full rates are approximately\r
\r
$$\r
R^+(\\gamma)\\approx 1.446927,\\qquad R(S)\\approx 1.446808.\r
$$`,j=`## The structure of the $L_k$ hierarchy\r
\r
For an integer $n>1$, consider $S\\in(n,n+1)$. From the previous results,\r
\r
$$\r
C_k(S)\\in\\{n,n+1\\},\r
$$\r
\r
and\r
\r
$$\r
L_k(S)=\\prod_{i=1}^kC_i(S).\r
$$\r
\r
We first record the piecewise-constant structure of the functions $C_k$ and $L_k$.\r
\r
For a function $f:(n,n+1)\\to\\mathbb R$, we call $S_0\\in(n,n+1)$ a **jump point** if the one-sided limits\r
\r
$$\r
f(S_0^-)=\\lim_{S\\uparrow S_0}f(S),\r
\\qquad\r
f(S_0^+)=\\lim_{S\\downarrow S_0}f(S)\r
$$\r
\r
exist and are different.\r
\r
Since\r
\r
$$\r
C_1(S)=\\lfloor S\\rfloor=n,\r
$$\r
\r
both $C_1$ and $L_1$ are constant on $(n,n+1)$.\r
\r
Now suppose that $L_{k-1}$ is piecewise constant. Denote\r
\r
$$\r
q_k(S)\r
=\r
\\frac{(S-1)S^{k-1}}{L_{k-1}(S)}\r
$$\r
\r
so that\r
\r
$$\r
C_k(S)=\\lfloor q_k(S)\\rfloor+1.\r
$$\r
\r
On every interval on which $L_{k-1}$ is constant, the function $q_k$ is strictly increasing. Since\r
\r
$$\r
C_k(S)\\in\\{n,n+1\\},\r
$$\r
\r
the only possible change of $C_k$ on such an interval is an upward jump from $n$ to $n+1$. This occurs precisely when\r
\r
$$\r
q_k(S)=n.\r
$$\r
\r
Thus $C_k$ is piecewise constant, and consequently\r
\r
$$\r
L_k=L_{k-1}C_k\r
$$\r
\r
is also piecewise constant.\r
\r
By induction, $C_k$ and $L_k$ are piecewise constant for every $k$.\r
\r
We now determine the possible locations of the jumps.\r
\r
Since\r
\r
$$\r
C_1(S)=n,\r
$$\r
\r
the factor $n$ occurs at least once in every $L_k$. Thus every possible value of $L_{k-1}$ has the form\r
\r
$$\r
L_{k-1}=n^u(n+1)^v,\r
\\qquad\r
u+v=k-1,\r
\\qquad\r
u\\ge1.\r
$$\r
\r
At a jump of $C_k$, we have\r
\r
$$\r
q_k(S)=n,\r
$$\r
\r
and hence\r
\r
$$\r
(S-1)S^{k-1}\r
=\r
nL_{k-1}(S).\r
$$\r
\r
Substituting\r
\r
$$\r
L_{k-1}=n^u(n+1)^v\r
$$\r
\r
gives\r
\r
$$\r
(S-1)S^{k-1}\r
=\r
n^{u+1}(n+1)^v.\r
$$\r
\r
Writing $a=u+1$, we obtain the candidate equations\r
\r
$$\r
(S-1)S^{k-1}\r
=\r
n^a(n+1)^{k-a},\r
\\qquad\r
a=2,\\ldots,k.\r
$$\r
\r
This motivates the definition\r
\r
$$\r
J_k\r
=\r
\\left\\{\r
S\\in(n,n+1):\r
(S-1)S^{k-1}\r
=\r
n^a(n+1)^{k-a}\r
\\text{ for some }a=2,\\ldots,k\r
\\right\\}.\r
$$\r
\r
Since\r
\r
$$\r
S\\mapsto(S-1)S^{k-1}\r
$$\r
\r
is strictly increasing for $S>1$, each of these equations has at most one solution.\r
\r
### Cancellation between consecutive levels\r
\r
The key relation is\r
\r
$$\r
q_{k+1}\r
=\r
\\frac{Sq_k}{C_k}.\r
$$\r
\r
Suppose that $C_k$ jumps upward at $S_0$. Then\r
\r
$$\r
q_k(S_0)=n.\r
$$\r
\r
Immediately before the jump,\r
\r
$$\r
C_k(S_0^-)=n,\r
$$\r
\r
and hence\r
\r
$$\r
q_{k+1}(S_0^-)\r
=\r
\\frac{S_0n}{n}\r
=\r
S_0\r
>\r
n.\r
$$\r
\r
Immediately after the jump,\r
\r
$$\r
C_k(S_0^+)=n+1,\r
$$\r
\r
so\r
\r
$$\r
q_{k+1}(S_0^+)\r
=\r
\\frac{S_0n}{n+1}\r
<\r
n,\r
$$\r
\r
because $S_0<n+1$.\r
\r
Thus $C_{k+1}$ jumps downward at the same point:\r
\r
$$\r
C_{k+1}(S_0^-)=n+1,\r
\\qquad\r
C_{k+1}(S_0^+)=n.\r
$$\r
\r
Consequently,\r
\r
$$\r
L_k(S_0^-)\r
=\r
nL_{k-1}(S_0),\r
$$\r
\r
while\r
\r
$$\r
L_k(S_0^+)\r
=\r
(n+1)L_{k-1}(S_0).\r
$$\r
\r
But at the next level,\r
\r
$$\r
L_{k+1}(S_0^-)\r
=\r
(n+1)nL_{k-1}(S_0)\r
=\r
L_{k+1}(S_0^+).\r
$$\r
\r
Thus an upward jump of $L_k$ is cancelled at the next level.\r
\r
### The jump points of $L_k$\r
\r
**Lemma**  \r
For every $k\\ge1$, the function $L_k$ on $(n,n+1)$ is piecewise constant with exactly $k-1$ jump points given by\r
\r
$$ \r
J_k = \\left\\{ S\\in(n,n+1): (S-1)S^{k-1} = n^a(n+1)^{k-a} \\text{ for some }a=2,\\ldots,k \\right\\}. \r
$$\r
\r
Moreover, as $S$ increases through $(n,n+1)$, the successive constant values of $L_k$ are\r
\r
$$ \r
n^k, \\quad n^{k-1}(n+1), \\quad \\ldots, \\quad n(n+1)^{k-1}. \r
$$\r
\r
**Proof**  \r
We proceed by induction on $k\\ge1$.\r
\r
For $k=1$, $L_1(S)=n$ throughout $(n,n+1)$. The set $J_1$ is empty, $L_1$ has no jump points, and it takes the single constant value $n^1$, so the statement holds.\r
\r
Now suppose the claim holds for level $k-1\\ge1$. By the induction hypothesis, $L_{k-1}$ has exactly $k-2$ jump points $s_1 < s_2 < \\cdots < s_{k-2}$ in $(n,n+1)$. Setting $s_0=n$ and $s_{k-1}=n+1$, these points divide $(n,n+1)$ into $k-1$ open subintervals $I_r = (s_r, s_{r+1})$ for $r=0,\\ldots,k-2$, on which $L_{k-1}$ takes the constant value\r
\r
$$\r
L_{k-1}(S) = n^{k-1-r}(n+1)^r.\r
$$\r
\r
On each subinterval $I_r$, the function \r
\r
$$\r
q_k(S) = \\frac{(S-1)S^{k-1}}{L_{k-1}(S)}\r
$$\r
\r
is continuous and strictly increasing.\r
\r
To determine the behavior of $q_k$ on each subinterval, we check its limits at the endpoints. At the left endpoint $s_0=n$, we have $q_k(n^+)=n-1<n$. At the right endpoint $s_{k-1}=n+1$, we have $q_k((n+1)^-)=n+1>n$. At each internal boundary $s_r$ ($r=1,\\ldots,k-2$), $C_{k-1}$ undergoes an upward jump, so by \r
\r
$$\r
q_k(S)=\\frac{Sq_{k-1}(S)}{C_{k-1}(S)}\r
$$\r
\r
and the inter-level cancellation result, $q_k(s_r^-) = s_rn/n > n$ and $q_k(s_r^+) = s_r n/(n+1) < n$.\r
\r
Since $q_k$ is continuous and strictly increasing on $I_r$, starting strictly below $n$ and ending strictly above $n$, the Intermediate Value Theorem implies that $q_k(S)=n$ has a unique solution $x_{r+1} \\in I_r$. Consequently, $C_k(S) = \\lfloor q_k(S)\\rfloor + 1$ jumps upward from $n$ to $n+1$ at $x_{r+1}$, and remains constant elsewhere on $I_r$.\r
\r
It remains to check whether $L_k = L_{k-1}C_k$ has any jump points at the internal boundaries $s_r$. Since $s_r$ is a jump point of $C_{k-1}$, the cancellation property establishes that the upward jump in $L_{k-1}$ is exactly offset by the downward jump of $C_k$ across $s_r$, yielding $L_k(s_r^-) = L_k(s_r^+)$. Thus $L_k$ is continuous across each $s_r$.\r
\r
Therefore, the jump points of $L_k$ on $(n,n+1)$ are precisely the $k-1$ points $x_1 < x_2 < \\cdots < x_{k-1}$. The equation $q_k(x_{r+1})=n$ unwinds to\r
\r
$$\r
(x_{r+1}-1)x_{r+1}^{k-1} = n^{k-r}(n+1)^r.\r
$$\r
\r
Writing $a=k-r$, as $r$ ranges from $0$ to $k-2$, $a$ ranges from $k$ down to $2$, which shows that the jump points are precisely the elements of $J_k$.\r
\r
Finally, as $S$ increases across $(n,n+1)$, $C_k$ equals $n$ on $(s_r, x_{r+1})$ and $n+1$ on $(x_{r+1}, s_{r+1})$. Multiplying by the constant value of $L_{k-1}$ on $I_r$ shows that $L_k$ takes the value $n^{k-r}(n+1)^r$ on $(x_r, x_{r+1})$, yielding the sequence of values $n^k, n^{k-1}(n+1), \\ldots, n(n+1)^{k-1}$. $\\blacksquare$\r
\r
### Jump points at different levels are distinct\r
\r
We now show that jump sets of different levels are disjoint.\r
\r
**Lemma.**  \r
Let $n>1$ be an integer. Suppose that $S\\in(n,n+1)$ satisfies\r
\r
$$\r
(S-1)S^{k-1}\r
=\r
n^a(n+1)^{k-a}\r
$$\r
\r
and\r
\r
$$\r
(S-1)S^{j-1}\r
=\r
n^b(n+1)^{j-b},\r
$$\r
\r
where\r
\r
$$\r
k>j\\ge2,\r
\\qquad\r
2\\le a\\le k,\r
\\qquad\r
2\\le b\\le j.\r
$$\r
\r
Then this is impossible.\r
\r
**Proof.**  \r
Dividing the two equations gives\r
\r
$$\r
S^{k-j}\r
=\r
n^{a-b}(n+1)^{(k-a)-(j-b)}.\r
$$\r
\r
Set\r
\r
$$\r
m=k-j,\r
\\qquad\r
p=a-b.\r
$$\r
\r
Then\r
\r
$$\r
S^m=n^p(n+1)^{m-p}.\r
$$\r
\r
Since\r
\r
$$\r
n<S<n+1,\r
$$\r
\r
we have\r
\r
$$\r
n^m<S^m<(n+1)^m.\r
$$\r
\r
This forces\r
\r
$$\r
0<p<m.\r
$$\r
\r
Indeed, if $p\\le0$, then\r
\r
$$\r
n^p(n+1)^{m-p}\\ge(n+1)^m,\r
$$\r
\r
while if $p\\ge m$, then\r
\r
$$\r
n^p(n+1)^{m-p}\\le n^m.\r
$$\r
\r
Now let\r
\r
$$\r
g=\\gcd(p,m),\r
\\qquad\r
p=gp',\r
\\qquad\r
m=gm',\r
$$\r
\r
so that\r
\r
$$\r
\\gcd(p',m')=1.\r
$$\r
\r
Taking the $g$-th root of the equation above gives\r
\r
$$\r
S^{m'}\r
=\r
n^{p'}(n+1)^{m'-p'}.\r
$$\r
\r
Set\r
\r
$$\r
A=n^{p'}(n+1)^{m'-p'}.\r
$$\r
\r
Thus\r
\r
$$\r
S^{m'}=A.\r
$$\r
\r
We now use the standard irreducibility criterion for binomials: if a positive rational number $A$ is not a $q$-th power in $\\mathbb Q$ for any prime $q\\mid m'$, then\r
\r
$$\r
X^{m'}-A\r
$$\r
\r
is irreducible over $\\mathbb Q$.\r
\r
We claim that this criterion applies to\r
\r
$$\r
A=n^{p'}(n+1)^{m'-p'}.\r
$$\r
\r
Let $q$ be any prime dividing $m'$. Since\r
\r
$$\r
\\gcd(p',m')=1,\r
$$\r
\r
neither $p'$ nor $m'-p'$ is divisible by $q$.\r
\r
Also, $n$ and $n+1$ are coprime, and they cannot both be $q$-th powers in $\\mathbb Q$, since they are consecutive integers. Hence at least one of $n$ and $n+1$ has a prime factor whose exponent in its prime factorization is not divisible by $q$.\r
\r
If this prime factor comes from $n$, its exponent in $A$ is multiplied by $p'$, which is not divisible by $q$. If it comes from $n+1$, its exponent is multiplied by $m'-p'$, which is also not divisible by $q$.\r
\r
Thus $A$ is not a $q$-th power in $\\mathbb Q$. Since this holds for every prime $q\\mid m'$, the binomial\r
\r
$$\r
X^{m'}-A\r
$$\r
\r
is irreducible over $\\mathbb Q$.\r
\r
Since $S$ is a root of this polynomial, its minimal polynomial over $\\mathbb Q$ has degree $m'$. Consequently,\r
\r
$$\r
1,S,\\ldots,S^{m'-1}\r
$$\r
\r
are linearly independent over $\\mathbb Q$.\r
\r
We now return to the first jump equation,\r
\r
$$\r
S^k-S^{k-1}\r
=\r
n^a(n+1)^{k-a}.\r
$$\r
\r
Its right-hand side is rational.\r
\r
Since\r
\r
$$\r
S^{m'}=A\\in\\mathbb Q,\r
$$\r
\r
we can write\r
\r
$$\r
k=qm'+r,\r
\\qquad\r
k-1=q'm'+r',\r
$$\r
\r
with\r
\r
$$\r
0\\le r,r'<m'.\r
$$\r
\r
Thus\r
\r
$$\r
S^k=A^qS^r,\r
\\qquad\r
S^{k-1}=A^{q'}S^{r'}.\r
$$\r
\r
The exponents $k$ and $k-1$ are consecutive, so\r
\r
$$\r
r\\ne r'.\r
$$\r
\r
Therefore the first jump equation becomes a nontrivial rational linear relation among\r
\r
$$\r
1,S,\\ldots,S^{m'-1}.\r
$$\r
\r
This contradicts their linear independence.\r
\r
Hence no such $S$ can exist.\r
$\\square$\r
\r
As an immediate consequence,\r
\r
$$\r
J_k\\cap J_j=\\varnothing\r
\\qquad\\text{whenever }k\\ne j.\r
$$\r
\r
\r
### Density of the jump points\r
\r
We now show that the union of the jump sets is dense.\r
\r
Let\r
\r
$$\r
J=\\bigcup_{k\\ge2}J_k.\r
$$\r
\r
Fix $\\theta\\in(0,1)$. Choose integers $a_k$ such that\r
\r
$$\r
2\\le a_k\\le k,\r
\\qquad\r
\\frac{a_k}{k}\\longrightarrow\\theta.\r
$$\r
\r
By the jump-point lemma, for each $k$ there is a unique point $S_k\\in J_k$ corresponding to the chosen $a_k$.\r
\r
Taking $k$-th roots gives\r
\r
$$\r
S_k\r
\\left(1-\\frac1{S_k}\\right)^{1/k}\r
=\r
n^{a_k/k}(n+1)^{1-a_k/k}.\r
$$\r
\r
The second factor on the left tends to $1$, while the right-hand side tends to\r
\r
$$\r
n^\\theta(n+1)^{1-\\theta}.\r
$$\r
\r
Hence\r
\r
$$\r
S_k\\longrightarrow\r
n^\\theta(n+1)^{1-\\theta}.\r
$$\r
\r
The function\r
\r
$$\r
\\theta\\longmapsto n^\\theta(n+1)^{1-\\theta}\r
$$\r
\r
is continuous and strictly increasing, with range $(n,n+1)$. Therefore every point of $(n,n+1)$ is a limit of points in $J$, and hence $J$ is dense in $(n,n+1)$.\r
\r
Since each $J_k$ is finite, $J$ is countable.\r
\r
### Uniform convergence of the rebuild-rate series\r
\r
We now use the structure of the $L_k$ to understand the dependence of the rebuild rate on $S$.\r
\r
Recall that\r
\r
$$\r
R(S)\r
=\r
\\sum_{k=0}^{\\infty}\\frac1{L_k(S)}.\r
$$\r
\r
Since $C_k(S)\\ge n$, we have $L_k(S)\\ge n^k$. Consequently,\r
\r
$$\r
0<\\frac1{L_k(S)}\\le\\frac1{n^k},\r
$$\r
\r
for every $S\\in(n,n+1)$.\r
\r
Thus the tail satisfies\r
\r
$$\r
\\sup_{S\\in(n,n+1)}\r
\\sum_{k>K}\\frac1{L_k(S)}\r
\\le\r
\\sum_{k>K}\\frac1{n^k}\r
=\r
\\frac{n^{-K-1}}{1-1/n}.\r
$$\r
\r
In particular, the series defining $R$ converges uniformly on $(n,n+1)$.\r
\r
This uniform tail estimate allows us to transfer the finite-level jump structure to the infinite sum.\r
\r
### Continuity away from the jump set\r
\r
Suppose that\r
\r
$$\r
S_0\\in(n,n+1)\\setminus J.\r
$$\r
\r
Fix $K$. Since\r
\r
$$\r
S_0\\notin J_1\\cup\\cdots\\cup J_K,\r
$$\r
\r
there is a neighborhood of $S_0$ containing none of these finitely many jump points. On this neighborhood,\r
\r
$$\r
L_1,\\ldots,L_K\r
$$\r
\r
are all constant. Therefore the partial sum\r
\r
$$\r
R_K(S)\r
=\r
\\sum_{k=0}^K\\frac1{L_k(S)}\r
$$\r
\r
is constant on that neighborhood.\r
\r
The remaining tail is uniformly bounded by\r
\r
$$\r
\\frac{n^{-K-1}}{1-1/n}.\r
$$\r
\r
Since this bound tends to zero as $K\\to\\infty$, the full function $R$ is continuous at $S_0$.\r
\r
Thus $R$ is continuous at every point outside $J$.\r
\r
### The jumps of $R$\r
\r
Now suppose that\r
\r
$$\r
S_0\\in J_k.\r
$$\r
\r
Since the sets $J_k$ are pairwise disjoint, no other level has a jump at $S_0$. Thus only the $k$-th summand contributes to the jump of $R$.\r
\r
At $S_0$, we have\r
\r
$$\r
L_k(S_0^-)\r
=\r
nL_{k-1}(S_0),\r
$$\r
\r
and\r
\r
$$\r
L_k(S_0^+)\r
=\r
(n+1)L_{k-1}(S_0).\r
$$\r
\r
Therefore\r
\r
$$\r
R(S_0^+)-R(S_0^-)\r
=\r
\\frac1{(n+1)L_{k-1}(S_0)}\r
-\r
\\frac1{nL_{k-1}(S_0)}\r
=\r
-\\frac1{n(n+1)L_{k-1}(S_0)}.\r
$$\r
\r
Thus $R$ has a downward jump at every point of $J$. It remains only to determine the value of $R$ at the jump itself.\r
\r
Since $q_k(S_0)=n$, we have\r
\r
$$\r
C_k(S_0)\r
=\r
\\lfloor q_k(S_0)\\rfloor+1\r
=\r
n+1.\r
$$\r
\r
Thus the value at the jump belongs to the upper branch: $L_k(S_0)=L_k(S_0^+)$. Therefore $R(S_0)=R(S_0^+)$.\r
\r
We have therefore proved the following.\r
\r
**Theorem**  \r
Fix an integer $n>1$ and consider the total rebuild rate\r
\r
$$\r
R(S)\r
=\r
\\sum_{k=0}^{\\infty}\\frac1{L_k(S)}\r
$$\r
\r
on the interval $(n,n+1)$. Let\r
\r
$$\r
J=\r
\\bigcup_{k\\ge2}J_k,\r
$$\r
\r
where\r
\r
$$\r
J_k\r
=\r
\\left\\{\r
S\\in(n,n+1):\r
(S-1)S^{k-1}\r
=\r
n^a(n+1)^{k-a}\r
\\text{ for some }a=2,\\ldots,k\r
\\right\\}.\r
$$\r
\r
Then:\r
\r
1. $J$ is countable and dense in $(n,n+1)$.\r
\r
2. $R$ is continuous at every point of\r
\r
   $$\r
   (n,n+1)\\setminus J.\r
   $$\r
\r
3. Every point $S_0\\in J_k$ is a discontinuity of $R$, with $R(S_0^+)=R(S_0)$ and \r
\r
   $$\r
   R(S_0^-)-R(S_0)\r
   =\r
   \\frac1{n(n+1)L_{k-1}(S_0)}.\r
   $$\r
\r
In particular, the discontinuity set of $R$ in $(n,n+1)$ is exactly $J$.\r
\r
**Proof**  \r
The three claims follow respectively from the density result, the continuity argument, and the jump calculation above.\r
$\\square$\r
`,M=`## Hierarchical tree problem\r
\r
Fix $S>1$ and denote\r
\r
$$\r
\\Delta_k=(S-1)S^{k-1}.\r
$$\r
\r
We always denote $n=\\lfloor S\\rfloor$. \r
\r
A **hierarchical tree of height $K\\ge 1$** is a rooted tree in which every node is assigned a level $k\\in\\{0,\\ldots,K\\}$, the root has level $K$, every level-$k$ node with $k\\ge1$ has at least one child, and all its children have level $k-1$. The level-0 nodes are the leaves. \r
\r
Every hierarchical tree has a uniquely determined **advance** function $a$, defined recursively from the leaves upward. For every level-0 node $I$, $a(I)=1$. For every level-$k$ node $I$, $k\\ge1$, with children $I_1,\\ldots,I_m$, define\r
\r
$$\r
a(I)\r
=\r
\\min\\left\\{\r
\\sum_{j=1}^m a(I_j),\\,S^k\r
\\right\\}.\r
$$\r
\r
A hierarchical tree $T$ is called **admissible** if\r
\r
$$\r
a(I)>\\Delta_k\r
$$\r
\r
for every level-$k$ node $I$ with $k\\ge1$. \r
\r
A node $I$ in a hierarchical tree is called admissible if the subtree rooted at $I$ is admissible.\r
\r
For a node $I$ denote\r
\r
$$\r
\\begin{aligned}\r
N(I)&=\\#\\{\\text{nodes in the subtree rooted at } I\\}, \\\\\r
C(I)&=\\#\\{\\text{children of node } I\\}, \\\\\r
L(I)&=\\#\\{\\text{leaves in the subtree rooted at } I\\}. \\\\\r
\\end{aligned}\r
$$\r
\r
Its **rate** is defined as\r
\r
$$\r
R(I)=\\frac{N(I)}{L(I)}.\r
$$\r
\r
Each of these is defined for a tree by applying it to the root node.\r
\r
If $T$ and $T'$ are admissible trees, we say that $T'$ **dominates** $T$ if $R(T')\\ge R(T)$. Strict domination is defined by the corresponding strict inequality.\r
\r
Equivalently, setting $\\Delta N = N(T') - N(T)$ and $\\Delta L = L(T') - L(T)$, $T'$ dominates $T$ if and only if\r
\r
$$\r
\\Delta N - R(T)\\Delta L \\ge 0.\r
$$\r
\r
We say that a tree $T^*$ is **globally dominating** if it is admissible and it dominates every other admissible tree of the same height.\r
\r
### Geodesic trees\r
\r
Define two sequences $(L_k)_{k\\ge0}$ and $(C_k)_{k>0}$ in the following way. Start with $L_0=1$. Once $L_{k-1}$ is defined, define $L_k=C_kL_{k-1}$, where $C_k$ is the smallest integer such that\r
\r
$$\r
C_kL_{k-1} > \\Delta_k.\r
$$\r
\r
Now define the **geodesic tree** $G_K(S)$ as the unique hierarchical tree of height $K$ with $C(I)=C_k$ for every level-$k$ node $I$ with $1\\le k\\le K$.\r
\r
**Lemma (geodesic trees are admissible)**  \r
Every level-$k$ node in $G_K(S)$ satisfies $a(I) = L_k$. Consequently, $G_K(S)$ is admissible.\r
\r
**Proof sketch**  \r
Prove by induction on $k$ that $a(I)=L_k\\le S^k$. \r
$\\blacksquare$\r
\r
The connection between rebuild intervals of an arc length parametrized path and admissible trees is the following.\r
\r
**Proposition**  \r
Let $S > 1$ and $(r_k) = (S^k)$. For any arc-length parametrized path $\\gamma: [0, \\infty) \\to X$ in a metric space $(X, d)$, the upper asymptotic rebuild rate satisfies\r
\r
$$\r
R^+(\\gamma) \\le \\sup_{K \\ge 1, \\, T \\in \\mathcal{T}_K} R(T),\r
$$\r
\r
where $\\mathcal{T}_K$ denotes the set of all admissible hierarchical trees of height $K$.\r
\r
**Proof**  \r
#### Rebuild intervals form hierarchical trees\r
\r
For each level $k \\ge 0$, a level-$k$ rebuild interval is a time interval $I = (t_1, t_2]$ bounded by two consecutive level-$k$ rebuild times $t_1 < t_2$. For $k \\ge 1$, the interval $(t_1, t_2]$ is partitioned by the intermediate level-$(k-1)$ rebuilds occurring at times $t_1 = \\tau_0 < \\tau_1 < \\cdots < \\tau_m = t_2$. The resulting level-$(k-1)$ intervals $J_p = (\\tau_{p-1}, \\tau_p]$ for $p = 1, \\dots, m$ are defined as the children of $I$.\r
\r
Recursively terminating this parent-child relation at level-$0$ intervals associates with any individual level-$k$ rebuild interval $I$ a finite hierarchical tree $T(I)$ rooted at $I$, of height $k$, whose leaves are level-$0$ intervals.\r
\r
#### Admissibility\r
\r
For any rebuild interval $J = (t_1, t_2]$ at level $k \\ge 0$, define its realized advance as the metric distance between its endpoints,\r
\r
$$\r
a'(J) = d(\\gamma(t_1), \\gamma(t_2)).\r
$$\r
\r
We prove by induction on $k$ that $a'(J) \\le a(J)$ and that $J$ satisfies the admissibility condition $a(J) > \\Delta_k$.\r
\r
For the base case $k = 0$, a level-$0$ rebuild triggers when $d(\\gamma(t_1), \\gamma(t_2)) = r_0 = 1$, so $a'(J) = 1 = a(J)$.\r
\r
For the inductive step $k \\ge 1$, suppose $J = (t_1, t_2]$ has child intervals $J_p = (\\tau_{p-1}, \\tau_p]$ for $p = 1, \\dots, m$ at level $k-1$, where $\\tau_0 = t_1$ and $\\tau_m = t_2$. By the triangle inequality in $(X, d)$,\r
\r
$$\r
a'(J) = d(\\gamma(t_1), \\gamma(t_2)) \\le \\sum_{p=1}^m d(\\gamma(\\tau_{p-1}), \\gamma(\\tau_p)) = \\sum_{p=1}^m a'(J_p).\r
$$\r
\r
Furthermore, before time $t_2$, the moving point remains within the level-$k$ ball centered at $\\gamma(t_1)$, so $d(\\gamma(t_1), \\gamma(t)) < r_k = S^k$ for $t\\in(t_1,t_2)$. Taking the limit $t \\to t_2^-$ gives $a'(J) = d(\\gamma(t_1), \\gamma(t_2)) \\le S^k$. Combining these bounds with the inductive hypothesis $a'(J_p) \\le a(J_p)$ yields\r
\r
$$\r
a'(J) \\le \\min\\left\\{\\sum_{p=1}^m a'(J_p), \\, S^k\\right\\} \\le \\min\\left\\{\\sum_{p=1}^m a(J_p), \\, S^k\\right\\} = a(J).\r
$$\r
\r
Finally, the level-$k$ rebuild triggers at $t_2$ precisely because the level-$k$ ball centered at $\\gamma(t_1)$ fails to enclose the updated level-$(k-1)$ ball at $\\gamma(t_2)$, which requires $d(\\gamma(t_1), \\gamma(t_2)) > \\Delta_k$. Consequently, $a(J) \\ge a'(J) > \\Delta_k$, establishing that for any level-$k$ rebuild interval $I$, the associated finite tree $T(I)$ is admissible.\r
\r
#### Counting the rebuild events\r
\r
Fix $t > 0$ and let $\\mathcal{I}(t)$ be the set of all rebuild intervals $I = (t_1, t_2]$ at any level $k \\ge 0$ fully contained in $(0, t]$, meaning $0 \\le t_1 < t_2 \\le t$. An interval in $\\mathcal{I}(t)$ is maximal if its parent interval is not contained in $(0, t]$, or if it has no parent. Let $I_1, \\dots, I_m$ be all maximal intervals in $\\mathcal{I}(t)$, and let $T_1, \\dots, T_m$ be the finite subtrees rooted at these intervals.\r
\r
Every interval $J \\in \\mathcal{I}(t)$ belongs to a unique maximal tree $T_i$, obtained by following its chain of parents upward within $\\mathcal{I}(t)$ until reaching a maximal interval. Thus, the node sets of $T_1, \\dots, T_m$ form a partition of $\\mathcal{I}(t)$. Moreover, because all initial centers coincide at $t = 0$, every non-initial level-$k$ rebuild time $t_{k, i} \\in (0, t]$ has its preceding rebuild time $t_{k, i-1} \\ge 0$. Hence, every non-initial rebuild event in $(0, t]$ is the right endpoint of a unique interval in $\\mathcal{I}(t)$, and each node in a subtree $T_i$ corresponds to exactly one such event. Summing across the partition yields the exact event count\r
\r
$$\r
M(t) = \\sum_{k=0}^\\infty m_k(t) = \\sum_{i=1}^m N(T_i).\r
$$\r
\r
#### Leaf count bound and asymptotic limit\r
\r
The leaves of $T_1, \\dots, T_m$ are level-$0$ intervals in $\\mathcal{I}(t)$. Because $\\gamma$ is arc-length parametrized, each leaf interval $J$ has length $|J|\\ge 1$. Since all leaf intervals across all maximal trees are mutually disjoint sub-intervals of $(0, t]$, their total length satisfies\r
\r
$$\r
t \\ge \\sum_{i=1}^m \\sum_{J \\in \\text{Leaves}(T_i)}|J| \\ge \\sum_{i=1}^m L(T_i).\r
$$\r
\r
Combining the event count and the time bound for any $t$ after the first level-$0$ rebuild gives\r
\r
$$\r
\\frac{M(t)}{t} \\le \\frac{\\sum_{i=1}^m N(T_i)}{\\sum_{i=1}^m L(T_i)} \\le \\max_{1 \\le i \\le m} \\frac{N(T_i)}{L(T_i)} \\le \\sup_{K \\ge 1, \\, T \\in \\mathcal{T}_K} R(T),\r
$$\r
\r
Taking the upper limit as $t \\to \\infty$ completes the proof. $\\blacksquare$\r
\r
This motivates us to study upper bounds for the rate of admissible trees. One immediate question is: Are geodesic trees $G_K(S)$ always globally dominating?\r
\r
We will later show that geodesic trees are globally dominating for all integer $S$, and also for all $K\\le 3$.\r
\r
However, the answer turns out to be generally no, as shown by an example given later. \r
\r
### Basic properties\r
\r
**Lemma (node replacement)**\r
Let $T$ be an admissible tree with a level-$k$ node $I$, and let $I'$ be another admissible level-$k$ node with $a(I') \\ge a(I)$. Then the tree $T'$ obtained by replacing the subtree rooted at $I$ with the subtree rooted at $I'$ is admissible.\r
\r
**Proof sketch**  \r
The recursive definition $a(J) = \\min\\left\\{\\sum a(J_j), S^m\\right\\}$ is composed of addition and the minimum operator, both of which are non-decreasing in every argument. Increasing the advance of a child node from $a(I)$ to $a(I')$ can therefore only increase or preserve the advance values of its ancestors, ensuring $a'(J) \\ge a(J) > \\Delta_m$ for all nodes $J$ outside the replaced subtree. $\\blacksquare$\r
\r
Reminder that we always write $n=\\lfloor S\\rfloor$.\r
\r
**Lemma**  \r
For every node $I$ at level $k$ in a hierarchical tree:\r
\r
i) $a(I)\\le L(I)$ for every $k\\ge 0$.  \r
ii) If $I$ is admissible, then $C(I) \\ge n$ for $k \\ge 1$.  \r
iii) If $I$ is admissible, then $a(I)\\ge n^k$ for every $k\\ge 0$.  \r
\r
**Proof sketch**  \r
Each claim can be proved by induction on $k$. $\\blacksquare$\r
\r
**Proof**  \r
We prove each claim by induction on $k$.\r
\r
**i)** For $k=0$, $a(I) = 1$. For $k \\ge 1$, assume the claim holds for each level $k-1$ node. Then\r
\r
$$\r
a(I)=\r
\\min\\left\\{ \\sum_{j=1}^p a(I_j),\\, S^k \\right\\}\r
\\le\r
\\sum_{j=1}^p L(I_j)\r
=L(I).\r
$$\r
\r
**ii)** Let $I$ be an admissible level-$k$ node ($k \\ge 1$) with $p = C(I)$ children $I_1, \\dots, I_p$. Since $I$ is admissible, each child $I_j$ is an admissible level-$(k-1)$ node. Admissibility of $I$ requires $a(I) > \\Delta_k = (S-1)S^{k-1}$. Since $a(I) \\le \\sum_{j=1}^p a(I_j) \\le p S^{k-1}$, we must have:\r
\r
$$\r
p S^{k-1} > (S-1)S^{k-1}.\r
$$\r
\r
Hence $p>S-1$. The strict inequality on the integer $p$ forces $p \\ge n$.\r
\r
**iii)** We proceed by induction on $k$. The base case for $k=0$ is true since $a(I)=1$ for leaves. \r
Assume that $a(I_j) \\ge n^{k-1}$ for each child $j$. Then\r
\r
$$\r
a(I) = \\min\\left\\{ \\sum_{j=1}^p a(I_j),\\, S^k \\right\\}.\r
$$\r
\r
\r
The first term satisfies $\\sum_{j=1}^p a(I_j) \\ge C(I)\\, n^{k-1} \\ge n^k$.\r
The second term satisfies $S^k\\ge n^k$ since $S\\ge n$.\r
Since both terms are at least $n^k$, we obtain $a(I) \\ge n^k$. $\\blacksquare$\r
\r
\r
When $S = n \\in \\mathbb{Z}_{\\ge 2}$, the geodesic sequence yields $C_k = n$ for all $k \\ge 1$, so $G_K(n)$ is the regular $n$-ary tree of height $K$.\r
\r
**Lemma**  \r
For every $k\\ge 1$, \r
\r
$$\r
C_k\\in\\{n,n+1\\}.\r
$$\r
\r
**Proof**  \r
We already know that $C_k \\ge n$ since any admissible level-$k$ node has at least $n$ children. \r
\r
For the upper bound when $k=1$, we have $(n+1)L_0 = n+1 > S-1 = \\Delta_1$. Since $C_1$ is the smallest integer with $C_1 L_0 > \\Delta_1$, we get $C_1 = n$.\r
\r
For $k \\ge 2$, the node $G_{k-1}$ is admissible, so $L_{k-1} > \\Delta_{k-1}$. Combining this with $n+1 > S$ yields\r
\r
$$\r
(n+1)L_{k-1} > S\\Delta_{k-1} = S(S-1)S^{k-2} = \\Delta_k.\r
$$\r
\r
By minimality of $C_k$, we conclude $C_k \\le n+1$. $\\blacksquare$\r
\r
\r
**Proposition (conjecture is true for integer $S$)**  \r
If $S = n \\in \\Z_{\\ge 2}$, then $G_K(n)$ is globally dominating.\r
\r
\r
**Proof**  \r
Let $T$ be an admissible tree of height $K$. We will prove by induction on level $k \\in \\{0, \\dots, K\\}$ that every admissible level-$k$ node $I$ in $T$ satisfies\r
\r
$$\r
R(I) \\le R\\bigl(G_k(n)\\bigr).\r
$$\r
\r
If $k=0$, then $I$ is a leaf, so $R(I) = 1 = R(G_0(n))$.\r
\r
Assume the claims hold for all admissible level-$(k-1)$ nodes. Let $I$ be an admissible level-$k$ node with children $I_1, \\dots, I_p$. By the previous lemma, admissibility implies $p = C(I) \\ge n$. Furthermore, each $I_j$ is an admissible level-$(k-1)$ node, so by the induction hypothesis:\r
\r
\r
$$\r
\\quad R(I_j) \\le R\\bigl(G_{k-1}(n)\\bigr) \\quad \\text{for all } j \\in \\{1, \\dots, p\\}.\r
$$\r
\r
We get\r
\r
$$\r
\\begin{aligned}\r
N(I) &= 1 + \\sum_{j=1}^p N(I_j) = 1 + \\sum_{j=1}^p R(I_j) L(I_j) \\\\\r
&\\le 1 + R\\bigl(G_{k-1}(n)\\bigr) \\sum_{j=1}^p L(I_j) = 1 + R\\bigl(G_{k-1}(n)\\bigr) L(I).\r
\\end{aligned}\r
$$\r
\r
Dividing both sides by $L(I) > 0$ yields\r
\r
$$\r
R(I) = \\frac{N(I)}{L(I)} \\le \\frac{1}{L(I)} + R\\bigl(G_{k-1}(n)\\bigr).\r
$$\r
\r
By the basic properties lemma, an admissible level-$k$ node satisfies $L(I) \\ge a(I) \\ge n^k$, which yields\r
\r
$$\r
R(I) \\le n^{-k} + R\\bigl(G_{k-1}(n)\\bigr).\r
$$\r
\r
For the regular $n$-ary tree $G_k(n)$, each internal node has $n$ identical children. It follows that $L(G_k(n))=n^k$ and each child of the root is $G_{k-1}(n)$. Expanding at the root node we get\r
\r
$$\r
R(G_k(n)) = \r
\\frac{N(G_k(n))}{L(G_k(n))}\r
=\r
\\frac{1 + n N(G_{k-1}(n))}{nL(G_{k-1}(n))} = n^{-k} + R(G_{k-1}(n)).\r
$$\r
\r
Combining this with our previous inequality we get $R(I) \\le R(G_k(n))$.\r
\r
By induction, the root of $T$ satisfies $R(T) \\le R(G_K(n))$. $\\blacksquare$\r
\r
For this reason we assume for the rest of the discussion that $S$ is not an integer, i.e. $n<S<n+1$.\r
\r
\r
### Existence of globally dominating trees\r
\r
**Lemma (admissibility threshold)**  \r
If a hierarchical tree node $I$ has at least $n+1$ admissible children, then $I$ is admissible.\r
\r
**Proof**  \r
Denote the children by $I_1,\\ldots,I_m$, $m\\ge n+1$. Since $n+1 > S$, we have \r
\r
$$\r
\\sum_{j=1}^m a(I_j) > (n+1)\\Delta_{k-1} = (n+1)(S-1)S^{k-2} > \\Delta_k.\r
$$\r
\r
Thus $I$ is admissible. $\\blacksquare$\r
\r
**Lemma (node splitting)**  \r
Let $T$ be an admissible tree of height $K$. If an internal node $I$ at level $k < K$ has $C(I) \\ge 2n + 2$ children, there exists an admissible tree $T'$ of height $K$ that strictly dominates $T$, obtained by replacing $I$ under its parent $P$ with two level-$k$ nodes $I_1$ and $I_2$.\r
\r
**Proof**  \r
Partition the children of $I$ under two new level-$k$ nodes $I_1$ and $I_2$, each receiving at least $n+1$ children. By the admissibility threshold lemma, $I_1$ and $I_2$ are admissible.\r
\r
Let $A_1$ and $A_2$ be the sums of advances of the children assigned to $I_1$ and $I_2$, respectively. Before replacement, $I$ supplied advance $a(I) = \\min\\{S^k, A_1+A_2\\}$. After replacement, the pair supplies\r
\r
$$\r
a(I_1) + a(I_2) = \\min\\{S^k, A_1\\} + \\min\\{S^k, A_2\\} \\ge \\min\\{S^k, A_1+A_2\\} = a(I).\r
$$\r
\r
Replacing $I$ with $I_1$ and $I_2$ under $P$ creates a modified parent node $P'$ whose advance satisfies $a(P') \\ge a(P)$. Applying node replacement to $P$ guarantees that the resulting tree $T'$ is admissible. Finally, $L(T') = L(T)$ and $N(T') = N(T) + 1$, so $R(T') > R(T)$. $\\blacksquare$\r
\r
**Lemma (uniformly bounded branching)**  \r
For every admissible tree $T$ of height $K$, there exists an admissible tree $T'$ of height $K$ that dominates $T$ and satisfies $C(I) \\le 2n + 1$ for all internal nodes $I$.\r
\r
**Proof**  \r
Apply the node splitting lemma bottom-up for levels $k=1$ to $K-1$. Each split strictly increases $N$ while keeping $L$ constant, producing a dominating admissible tree $T_1$ with $C(I) \\le 2n+1$ for all non-root internal nodes.\r
\r
Next we handle the root. If $C(T_1) \\ge n + 2$, the rate $R(T_1)$ satisfies\r
\r
$$\r
R(T_1) = \\frac{1}{L(T_1)} + \\sum_{J\\prec T_1} \\frac{L(J)}{L(T_1)} R(J).\r
$$\r
\r
Because $R(T_1)$ strictly exceeds the weighted average of its children's rates, there exists a child $J$ with $R(J) < R(T_1)$. Removing $J$ produces a tree $T_2$ whose root retains at least $n+1$ children (hence remaining admissible) and has rate\r
\r
$$\r
R(T_2) = \\frac{N(T_1)-N(J)}{L(T_1)-L(J)} > R(T_1).\r
$$\r
\r
Repeating this removal process until the root has at most $n+1$ children yields a tree $T'$ with $C(I) \\le 2n+1$ at all levels that dominates $T$. $\\blacksquare$\r
\r
**Theorem (globally dominating trees exist)**  \r
For every $K \\ge 1$, there exists a globally dominating admissible tree of height $K$.\r
\r
**Proof**  \r
By previous lemma, every admissible tree is dominated by one in which every node has at most $2n+1$ children. Since height and branching are uniformly bounded, the set of such tree topologies is finite. Thus, the set of achievable rates $R(T)$ among these bounded trees is non-empty and finite, so it contains a maximum $R(T^*)$. Now $T^*$ dominates every admissible tree of height $K$. $\\blacksquare$\r
\r
#### Geodesic lift\r
\r
Let $I$ be an admissible node of level $k$. We define the **geodesic lift** of $I$ to be the tree obtained by starting with $I$ and repeatedly copying the current tree the smallest number of times needed to form an admissible node at the next level.\r
\r
More precisely, set $I^{(0)}=I$. Given $I^{(j-1)}$, let\r
\r
$$\r
m_j = \\left\\lfloor \\frac{\\Delta_{k+j}}{a(I^{(j-1)})} \\right\\rfloor + 1.\r
$$\r
\r
Thus $m_j$ is the smallest positive integer such that $m_j a(I^{(j-1)}) > \\Delta_{k+j}$. Making $m_j$ copies of $I^{(j-1)}$ the children of a new node $I^{(j)}$ yields total advance $m_j a(I^{(j-1)}) \\le \\Delta_{k+j} + a(I^{(j-1)}) \\le S^{k+j}$. Hence the advance cap at level $k+j$ is inactive, so $a(I^{(j)}) = m_j a(I^{(j-1)})$.\r
\r
We may continue up to level $K$, producing the geodesic lift $I^{\\langle K\\rangle}$ of $I$ to height $K$. The node and leaf counts satisfy $N(I^{(j)}) = 1 + m_j N(I^{(j-1)})$ and $L(I^{(j)}) = m_j L(I^{(j-1)})$, which yields\r
\r
$$\r
R(I^{(j)}) = R(I^{(j-1)}) + \\frac{1}{m_j L(I^{(j-1)})}.\r
$$\r
\r
Unrolling this recurrence gives\r
\r
$$\r
R(I^{\\langle K\\rangle}) = R(I) + \\frac{1}{L(I)} \\sum_{j=1}^{K-k} \\frac{1}{m_1 \\cdots m_j}.\r
$$\r
\r
In particular, the geodesic lift strictly increases rate: $R(I^{\\langle K\\rangle}) > R(I)$.\r
\r
The geodesic tree $G_K(S)$ is the geodesic lift of a leaf. More generally, the geodesic lift of any of its nodes is the tree itself.\r
\r
**Lemma**  \r
Suppose $T$ is a globally dominating tree of height $K$, and let $I$ be one of its non-root nodes. Then $R(I) < R(T)$. In particular, the tree $T'$ obtained by removing $I$ from $T$ cannot be admissible.\r
\r
**Proof**  \r
The geodesic lift $I^{\\langle K\\rangle}$ is an admissible tree of height $K$. Since $T$ is globally dominating, $R(I^{\\langle K\\rangle}) \\le R(T)$, which gives $R(I) < R(I^{\\langle K\\rangle}) \\le R(T)$.\r
\r
If $T'$ is formed by removing the subtree rooted at $I$ from $T$, its rate satisfies\r
\r
$$\r
R(T') = \\frac{N(T) - N(I)}{L(T) - L(I)} > \\frac{N(T) - R(T)L(I)}{L(T) - L(I)} = R(T).\r
$$\r
\r
If $T'$ were admissible, $R(T') > R(T)$ would contradict the global dominance of $T$. $\\blacksquare$\r
\r
### Investigating low level nodes\r
\r
**Proposition (upper bound for $R$)**  \r
Suppose that every level-$k$ admissible node $I$ satisfies\r
\r
$$\r
R(I)\\le r_k.\r
$$\r
\r
Then every admissible tree $T$ of height $K>k$ satisfies\r
\r
$$\r
R(T)\r
\\le \r
r_k+\r
\\sum_{j=k+1}^K \\frac1{u_j},\r
$$\r
\r
where\r
\r
$$\r
u_j = \\max\\bigl\\{\\lfloor\\Delta_j\\rfloor+1, n^j\\bigr\\}.\r
$$\r
\r
In particular, \r
\r
$$\r
\\begin{aligned}\r
R(T)\r
&\\le r_k + \r
\\frac{S(S^{-k}-S^{-K})}{(S-1)^2}\\qquad\\text{and} \\\\\r
R(T)\r
&\\le r_k + \r
\\frac{n^{-k}-n^{-K}}{n-1},\\qquad (n>1).\r
\\end{aligned}\r
$$\r
\r
**Proof**  \r
Let $M_j$ denote the number of level-$j$ nodes in $T$, and let $M_{>k} = \\sum_{j=k+1}^K M_j$ be the number of nodes strictly above level $k$. Since the level-$k$ subtrees partition all nodes at or below level $k$, we can split the total node count as $N(T) = M_{>k} + \\sum_{\\operatorname{level}(I)=k} N(I)$. Dividing by $L(T)$ yields\r
\r
$$\r
R(T) = \\frac{M_{>k}}{L(T)} + \\sum_{\\operatorname{level}(I)=k} \\frac{L(I)}{L(T)} R(I).\r
$$\r
\r
Applying the bound $R(I) \\le r_k$ to each level-$k$ subtree gives $R(T) \\le r_k + \\frac{M_{>k}}{L(T)}$.\r
\r
For every level-$j$ node $I$ with $j > k$, admissibility requires $a(I)>\\Delta_j$. Since $L(I) \\ge a(I)$ and $L(I)$ is an integer, we have $L(I) \\ge \\lfloor \\Delta_j \\rfloor + 1$. Disjointness of the level-$j$ subtrees then implies\r
\r
$$\r
M_j \\le \\frac{L(T)}{\\lfloor\\Delta_j \\rfloor + 1}.\r
$$\r
\r
Alternatively, since every internal node has at least $n$ children, $M_{j-1} \\ge n M_j$. With $M_0 = L(T)$, this gives $M_j \\le n^{-j} L(T)$.\r
\r
Together the bounds give $M_j \\le L(T)/u_j$, so $M_{>k}/L(T)\\le \\sum_{j=k+1}^K 1/u_j$.\r
\r
Finally, using the bounds $u_j > \\Delta_j$ and $u_j\\ge n^{j}$, summing over $j = k+1, \\ldots, K$ as finite geometric series yields the explicit bounds. $\\blacksquare$\r
\r
The previous proposition is interesting since it can benefit from information from small $k$. Once a bound is known for level $k$, then we get a new bound for every tree higher than $k$. One immediate consequence of the proposition is that \r
\r
$$\r
R(T)<\\frac{n}{n-1}\r
$$\r
\r
whenever $n>1$ as we can see by applying it with $r_0=1$.\r
\r
#### Level-$1$\r
\r
We say that a level-$k$ node $I$ is saturated if $a(I)=S^k$. \r
\r
**Theorem (level-$1$ solve)**  \r
Let $I$ be a level-$1$ node in a globally dominating tree. Then\r
\r
$$\r
C(I)=n.\r
$$\r
\r
**Proof**  \r
If the tree has height $K=1$, the root $I$ satisfies $R(I) = \\bigl(1+C(I)\\bigr)/C(I) = 1 + 1/C(I)$. Admissibility requires $a(I) = \\min\\{C(I), S\\} > S-1$, which holds for any integer $C(I) \\ge n$. Maximizing $1 + 1/C(I)$ over $C(I) \\ge n$ forces $C(I) = n$.\r
\r
For the remainder of the proof, assume $K \\ge 2$, so $I$ is a non-root node. We already know $C(I) \\ge n$.\r
\r
Since leaves have advance $1$, a level-$1$ node with $C(I) \\ge n+1$ children has advance $a(I) = \\min\\{C(I), S\\} = S$. If $C(I) > n+1$, removing one leaf leaves $C(I)-1 \\ge n+1$ children, keeping $a(I) = S$ unchanged. This preserves admissibility throughout the tree, which contradicts the lemma that removing a non-root node from a globally dominating tree yields an inadmissible tree. Thus $C(I) \\le n+1$.\r
\r
Suppose $C(I) = n+1$. Replace $I$ under its parent $P$ with two level-$1$ nodes $I_1$ and $I_2$, each having $n$ children. Their advances are $a(I_1) = a(I_2) = \\min\\{n, S\\} = n$. Since $n = \\lfloor S \\rfloor \\ge 1$, we have $2n > S$, so the combined advance supplied to $P$ increases from $S$ to $2n$. By monotonicity of the advance function, $T'$ remains admissible.\r
\r
The replacement changes the total node and leaf counts by\r
\r
$$\r
\\Delta N = 2(n+1) - (n+2) = n, \\qquad \\Delta L = 2n - (n+1) = n-1.\r
$$\r
\r
We evaluate the domination condition $\\Delta N - R(T)\\Delta L = n - R(T)(n-1)$:\r
* If $n=1$, $\\Delta L = 0$ and $\\Delta N = 1 > 0$.\r
* If $n > 1$, applying the rate upper bound proposition with $r_0=1$ yields $R(T) < \\frac{n}{n-1}$, so $R(T)(n-1) < n$.\r
\r
In both cases, $\\Delta N - R(T)\\Delta L > 0$, meaning $T'$ strictly dominates $T$. This contradicts the global dominance of $T$, proving $C(I) = n$. $\\blacksquare$\r
\r
#### Level-$2$\r
\r
Next we examine level-$2$ nodes. We already have name for the geodesic tree $G_2=[C_2\\times G_1]$. Let us denote\r
\r
$$\r
\\begin{aligned}\r
F_2&=[(C_2+1)\\times G_1]. \\\\\r
\\end{aligned}\r
$$ \r
\r
**Lemma**  \r
Suppose that $T$ is globally dominating tree of height $K$.  \r
i) If $K=1$, then $T=G_1$.  \r
ii) If $K=2$, then $T=G_2$. \r
\r
**Proof**  \r
**i)** The case $K=1$ follows from the level-$1$ solve. \r
\r
**ii)** Level-$1$ solve imples that every globally dominating tree of height $2$ has the form $[m\\times G_1]$ for some $m\\ge C_2$. Also,\r
\r
$$\r
R\\bigl([m\\times G_1]\\bigr)=\\frac{1+m+mn}{mn}=\\frac{1}{mn}+\\frac1n+1\r
$$\r
\r
is strictly decreasing as a function of $m$. Therefore $G_2=[C_2\\times G_1]$ is the unique maximizer of the rate among all admissible trees of height $2$.\r
$\\blacksquare$\r
\r
**Lemma (level-$2$ dichotomy)**  \r
Suppose $I$ is a level-$2$ node in a globally dominating tree $T$.\r
\r
i) Either $I=G_2$ or $I=F_2$. In other words, $C(I) \\in \\{C_2, C_2+1\\}$.  \r
ii) If $C_2=n$, then $C(I)=n$ and $I=G_2$.\r
\r
**Proof**  \r
If the tree height is $2$, then $C(I)=C_2$ by the previous lemma. Assume from now on that the tree height is at least $3$, and denote the parent of $I$ by $P$.\r
\r
**i)** Define the level-$2$ node $H=[(n+1)\\times G_1]$. It is admissible, with leaf and node counts given by\r
\r
$$\r
L(H)=(n+1)n \\quad \\text{and} \\quad N(H)=n^2+2n+2.\r
$$\r
\r
Suppose that $C(I)\\ge C_2+2$. We modify $T$ by removing two level-$1$ children from $I$ and adding one level-$2$ node $H$ as a child to $P$.\r
\r
Node $I$ retains at least $C_2$ children, so it remains admissible. Consider the advance at $P$. The removal reduces the sum of its children's advances by at most $2S$, while adding $H$ increases this sum by\r
\r
$$\r
a(H) = \\min\\{(n+1)n,\\, S^2\\} > 2S.\r
$$\r
\r
This implies that $a(P)$ does not decrease. Applying node replacement guarantees that the modified tree $T'$ is admissible.\r
\r
The replacement yields count changes of\r
\r
$$\r
\\Delta L = L(H) - 2n = n^2 - n\r
$$\r
\r
and\r
\r
$$\r
\\Delta N = N(H) - 2(1+n) = n^2.\r
$$\r
\r
Evaluating the domination condition gives\r
\r
$$\r
\\Delta N - R(T)\\Delta L = n^2 - R(T)n(n-1).\r
$$\r
\r
If $n=1$, this is strictly positive. If $n>1$, the upper bound proposition gives $R(T) < n/(n-1)$, which again implies $\\Delta N - R(T)\\Delta L > 0$. The modified tree strictly dominates $T$, contradicting global dominance.\r
\r
**ii)** Suppose $C_2=n$. By part i), $C(I) \\le n+1$, so assume $C(I)=n+1$. We remove one level-$1$ child from $I$ and add one $G_2=[n\\times G_1]$ to $P$.\r
\r
Node $I$ retains $n$ children and remains admissible. The sum of children's advances under $P$ decreases by at most $S$ from the removed child, while adding $G_2$ increases this sum by $a(G_2) = n^2 \\ge S$. This implies that $a(P)$ does not decrease, preserving tree admissibility.\r
\r
The count changes are identical to part i):\r
\r
$$\r
\\Delta L = n^2 - n \\quad \\text{and} \\quad \\Delta N = n^2.\r
$$\r
\r
The same argument yields $\\Delta N - R(T)\\Delta L > 0$, contradicting the global dominance of $T$. $\\blacksquare$\r
\r
Note that the counter-example mentioned below uses the node $F_2$.\r
\r
#### Level-$3$\r
\r
Let us now consider level-$3$ nodes in a globally dominating tree.\r
\r
**Lemma**  \r
In a globally dominating tree, any level-$3$ node $I$ with children $I_1,\\ldots,I_m$ satisfies\r
\r
$$\r
\\#\\{j : I_j = F_2\\} \\le 1.\r
$$\r
\r
In other words, every level-$2$ child of a level-$3$ node is of type $G_2$, except possibly at most one of type $F_2$.\r
\r
**Proof**  \r
By the level-$2$ dichotomy, $I_j = F_2$ can only occur if $C_2 = n+1$. We may therefore assume $C_2 = n+1$.\r
\r
Suppose, for contradiction, that $I$ has at least two $F_2$ children. We modify $I$ by replacing two $F_2$ children with three $G_2$ children, i.e., $2\\times F_2 \\leadsto 3\\times G_2$.\r
\r
The sum of advances of the children of $I$ changes by\r
\r
$$\r
3a(G_2) - 2a(F_2) = 3(n+1)n - 2\\min\\{(n+2)n, S^2\\} \\ge 3(n+1)n - 2(n+2)n = n^2 - n \\ge 0.\r
$$\r
\r
This implies that $a(I)$ does not decrease. Applying node replacement guarantees that the resulting tree $T'$ is admissible.\r
\r
Next, we evaluate the changes in leaf and node counts:\r
\r
$$\r
\\Delta L = 3L(G_2) - 2L(F_2) = 3(n+1)n - 2(n+2)n = n^2 - n,\r
$$\r
\r
$$\r
\\Delta N = 3N(G_2) - 2N(F_2) = 3(n^2+2n+2) - 2(n^2+3n+3) = n^2.\r
$$\r
\r
Evaluating the domination condition yields\r
\r
$$\r
\\Delta N - R(T)\\Delta L = n^2 - R(T)n(n-1).\r
$$\r
\r
If $n=1$, this expression equals $1 > 0$. If $n>1$, the rate upper bound proposition (with $r_0=1$) gives $R(T) < n/(n-1)$, which implies $R(T)n(n-1) < n^2$ and thus $\\Delta N - R(T)\\Delta L > 0$. The modified tree $T'$ strictly dominates $T$, contradicting global dominance. $\\blacksquare$\r
\r
**Proposition**  \r
If $T$ is a globally dominating tree of height $3$, then $T=G_3$.\r
\r
**Proof**  \r
Suppose $T$ is globally dominating. Let $m=C(T)$. By the level-$3$ child lemma, $T$ has at most one $F_2$ child, so\r
\r
$$\r
T=[m\\times G_2] \\quad \\text{or} \\quad T=[(m-1)\\times G_2,\\, F_2].\r
$$\r
\r
In the first case, $T=[m\\times G_2]$, the rate evaluates to\r
\r
$$\r
R(T) = \\frac{1+m+mC_2+mC_2n}{mC_2n} = \\frac{1}{mC_2n} + \\frac{1}{C_2n} + \\frac{1}{n} + 1.\r
$$\r
\r
This expression is strictly decreasing in $m$, so $R(T)$ is maximized at the smallest admissible choice of $m$, which is $m=C_3$ by definition of the geodesic tree $G_3$.\r
\r
Now consider the second case, $T=[(m-1)\\times G_2,\\, F_2]$. This tree can be globally dominating only if $C_2 = n+1$, so we assume $C_2 = n+1$.\r
\r
The total leaf and node counts are given by\r
\r
$$\r
L(T) = (m-1)L(G_2) + L(F_2) = (m-1)(n+1)n + (n+2)n = m(n+1)n + n,\r
$$\r
\r
and\r
\r
$$\r
\\begin{aligned}\r
N(T) &= 1 + (m-1)N(G_2) + N(F_2) \\\\\r
&= 1 + (m-1)(n^2+2n+2) + (n^2+3n+3) \\\\\r
&= m(n^2+2n+2) + n + 2.\r
\\end{aligned}\r
$$\r
\r
Expanding $R(T)$ yields\r
\r
$$\r
\\begin{aligned}\r
R(T) &= \\frac{m(n^2+2n+2)+n+2}{m(n+1)n+n} \\\\\r
&= 1 + \\frac{1}{n} \\cdot \\frac{m(n+2)+2}{m(n+1)+1} \\\\\r
&= 1 + \\frac{1}{n} + \\frac{1}{n(n+1)} + \\frac{1}{(n+1)\\bigl(m(n+1)+1\\bigr)}.\r
\\end{aligned}\r
$$\r
\r
Since $C_2 = n+1$, the geodesic tree rate at height $3$ is\r
\r
$$\r
R(G_3) = \\frac{1}{C_3(n+1)n} + \\frac{1}{(n+1)n} + \\frac{1}{n} + 1.\r
$$\r
\r
Comparing the two rates gives\r
\r
$$\r
n(n+1)\\bigl(R(T)-R(G_3)\\bigr) = \\frac{n}{m(n+1)+1} - \\frac{1}{C_3} \\le \\frac{n}{m(n+1)+1} - \\frac{1}{n+1} = \\frac{(n+1)(n-m)-1}{(n+1)\\bigl(m(n+1)+1\\bigr)}.\r
$$\r
\r
If $m \\ge n$ or $n=1$, the numerator $(n+1)(n-m)-1$ is negative, forcing $R(T) < R(G_3)$. Since $T$ is globally dominating, we must have $m \\le n-1$ and $n \\ge 2$.\r
\r
To show that $m \\le n-1$ and $n \\ge 2$ lead to a contradiction, we bound the advance $a(T)$. Using $a(G_2)=(n+1)n$ and $a(F_2) \\le (n+2)n$, we obtain\r
\r
$$\r
a(T) \\le (m-1)(n+1)n + (n+2)n = \\bigl(m(n+1)+1\\bigr)n.\r
$$\r
\r
Because $m \\le n-1$, the factor $m(n+1)+1 \\le (n-1)(n+1)+1 = n^2$, which gives $a(T) \\le n^3$.\r
\r
Finally, $C_2 = n+1$ implies that $n$ copies of $G_1$ fail to satisfy level-$2$ admissibility, meaning $n^2 \\le \\Delta_2 = (S-1)S$. Multiplying by $S > n$ yields\r
\r
$$\r
n^3 < n^2 S \\le (S-1)S^2 = \\Delta_3.\r
$$\r
\r
Thus $a(T) \\le n^3 < \\Delta_3$, which contradicts the admissibility of $T$. $\\blacksquare$\r
\r
We utilize the established results to derive an upper bound for the rates.\r
\r
**Proposition**  \r
Let $T$ be an admissible tree of height $K\\ge 4$. Then\r
\r
$$\r
R(T)\\le R\\bigl(G_3(S)\\bigr) + \\sum_{j=4}^K \\frac{1}{u_j},\r
$$\r
\r
where\r
\r
$$\r
u_j = \\max\\left\\{ n\\left\\lfloor \\frac{\\Delta_j}{n}+1 \\right\\rfloor, \\; \\ell_3^\\text{min} \\, n^{j-3} \\right\\},\r
$$\r
\r
and $\\ell_3^\\text{min}$ is a lower bound for leaf count of a level-3 node in a globally dominating tree, given by \r
\r
$$\r
\\begin{aligned}\r
\\ell_3^\\text{min}&=\\min\\left\\{ L(G_3), \\, \\bigl(m_3^\\text{min}(n+1)+1\\bigr)n \\right\\}, \\\\\r
m_3^\\text{min}&=\\biggl\\lfloor\\frac{\\Delta_3-a(F_2)}{L(G_2)}\\biggr\\rfloor+2. \\\\\r
\\end{aligned}\r
$$\r
\r
**Proof**  \r
Without loss of generality we can assume that $T$ is globally dominating.\r
\r
Partitioning the node count of $T$ at level 3 yields\r
\r
$$\r
R(T) = \\frac{M_{>3}}{L(T)} + \\sum_{\\text{level}(I)=3} \\frac{L(I)}{L(T)} R(I),\r
$$\r
\r
where $M_{>3} = \\sum_{j=4}^K M_j$ is the total count of nodes strictly above level 3, and $M_j$ denotes the number of level-$j$ nodes in $T$.\r
\r
Since $G_3$ is the unique rate maximizer among all admissible height-3 trees, every level-3 subtree $I$ in $T$ satisfies $R(I) \\le R(G_3)$. The second term is a convex combination of level-3 rates, bounded above by $R(G_3)$.\r
\r
To bound $M_{>3} / L(T)$, we establish two independent lower bounds on the leaf count $L(I)$ of any level-$j$ node $I$ in $T$ for $j \\ge 4$.\r
\r
First, by the level-1 solve theorem, every level-1 node in a globally dominating tree has $n$ children, forcing $L(I)$ to be an integer multiple of $n$. Admissibility requires $L(I) \\ge a(I) > \\Delta_j$. The smallest integer multiple of $n$ strictly exceeding $\\Delta_j$ is $n \\lfloor \\frac{\\Delta_j}{n}+1 \\rfloor$, giving the lower bound $L(I) \\ge n \\lfloor \\frac{\\Delta_j}{n}+1 \\rfloor$.\r
\r
Now suppose that $J$ is a level-$3$ node in $T$. By the level-3 child lemma it consists of level-2 children of type $G_2$, with at most one child of type $F_2$. If all children are of type $G_2$, admissibility forces at least $C_3$ children, so $L(J) \\ge L(G_3)$. If one child is of type $F_2$, then $J=[(m-1)\\times G_2,F_2]$ for some $m\\ge n$, and admissibility requires\r
\r
$$\r
(m-1)L(G_2) + a(F_2) > \\Delta_3.\r
$$\r
\r
The minimum $m$ satisfying this is $m_3^\\text{min}$. Now\r
\r
$$\r
L(J)\\ge (m_3^\\text{min}-1)L(G_2) + L(F_2) = \\bigl(m_3^\\text{min}(n+1)+1\\bigr)n.\r
$$\r
\r
Taking the minimum across both cases gives $L(J) \\ge \\ell_3^\\text{min}$ for every level-3 node in $T$. Since every internal node has at least $n$ children, a level-$j$ node $I$ with $j \\ge 4$ contains at least $n^{j-3}$ disjoint level-3 subtrees, yielding $L(I) \\ge \\ell_3^\\text{min} \\, n^{j-3}$.\r
\r
Combining both lower bounds gives $L(I) \\ge u_j$, which implies $M_j \\le L(T)/u_j$ for each $j \\in \\{4, \\dots, K\\}$. Summing over $j$ yields\r
\r
$$\r
\\frac{M_{>3}}{L(T)} = \\sum_{j=4}^K \\frac{M_j}{L(T)} \\le \\sum_{j=4}^K\\frac{1}{u_j}.\r
$$\r
\r
Substituting these inequalities into the decomposition of $R(T)$ yields $R(T) \\le R(G_3) + \\sum_{j=4}^K 1/u_j$. \r
$\\blacksquare$\r
\r
#### Example: geodesic trees are not always globally dominating\r
\r
Let $S = 147/40 = 3.675$ (so that $n=3$) and $K = 5$. The admissibility thresholds $\\Delta_k = (S-1)S^{k-1}$ are:\r
\r
$$\r
\\Delta_1 = 2.675, \\quad \\Delta_2\\approx 9.831, \\quad \\Delta_3 \\approx 36.128, \\quad \\Delta_4 \\approx 132.769, \\quad \\Delta_5 \\approx 487.925.\r
$$\r
\r
The geodesic branching sequence is \r
\r
$$\r
(C_1, C_2, C_3, C_4, C_5) = (3, 4, 4, 3, 4),\r
$$\r
\r
yielding geodesic leaf count $L(G_5) = 576$, node count $N(G_5) = 833$, and rate\r
\r
$$\r
R\\bigl(G_5(S)\\bigr) = \\frac{833}{576} \\approx 1.446181.\r
$$\r
\r
Now define the non-geodesic tree $T$ recursively by\r
\r
$$\r
F_2 = [5 \\times G_1], \\quad F_3 = [2 \\times G_2,\\, F_2], \\quad F_4 = [2 \\times G_3,\\, F_3], \\quad T = [4 \\times F_4].\r
$$\r
\r
The advance, leaf count, and node count for each component evaluate as follows:\r
\r
$$\r
\\begin{array}{|c|c|c|c|c|c|}\r
\\hline\r
\\text{Node $I$} & \\text{Level $k$} & \\text{Advance $a(I)$} & \\text{Threshold $\\Delta_k$} & L(I) & N(I) \\\\\r
\\hline\r
F_2 & 2 & S^2 \\approx 13.506 & 9.831 & 15 & 21 \\\\\r
\\hline\r
F_3 & 3 & 2(12) + a(F_2) \\approx 37.506 & 36.128 & 39 & 56 \\\\\r
\\hline\r
F_4 & 4 & 2(48) + a(F_3) \\approx 133.506 & 132.769 & 135 & 195 \\\\\r
\\hline\r
T & 5 & 4 a(F_4) \\approx 534.023 & 487.925 & 540 & 781 \\\\\r
\\hline\r
\\end{array}\r
$$\r
\r
Since $a(I) > \\Delta_k$ at every level, $T$ is admissible. Its rate is\r
\r
$$\r
R(T) = \\frac{781}{540} \\approx 1.446296.\r
$$\r
\r
Comparing the rates reveals $R(T) > R\\bigl(G_5(S)\\bigr)$, showing that geodesic trees are not always globally dominating.\r
\r
What does the upper bound result tell us? In this case $m_3^\\text{min}=3$ and $\\ell_3^\\text{min}=39$ so that $u_4=135$ and $u_5=489$. Therefore for this $S$, every admissible tree $T'$ of height $5$ satisfies\r
\r
$$\r
R(T')\\le R(G_3)+\\frac{1}{u_4}+\\frac{1}{u_5}=\\frac{1+C_3+C_3C_2+C_3C_2n}{C_3C_2n}+\\frac{1}{135}+\\frac{1}{489}=\\frac{509443}{352080}\\approx 1.446952.\r
$$\r
\r
### Bounding upper asymptotic rebuild rate\r
\r
Applying this to the upper asymptotic rebuild rates of paths gives the following.\r
\r
**Corollary**  \r
Let $\\gamma:[0,\\infty)\\to X$ be an arc-length parametrized path in a metric space $(X,d)$. Let $S>1$ and $(r_k)=(S^k)$. Then the upper asymptotic rebuild rate satisfies \r
\r
$$\r
R^+(\\gamma)\\le R\\bigl(G_3(S)\\bigr) + \\sum_{j=4}^\\infty \\frac{1}{u_j},\r
$$\r
\r
where $u_j$ are as in the previous proposition.\r
$\\blacksquare$\r
\r
Below is a plot including\r
- this improved bound (blue), \r
- the simple upper bound $n/(n-1)$ (orange, $n>1$), \r
- the geodesic rebuild rate function $R$ (black), \r
- the counter-example for paths with $S=3.675$ (red dot). \r
\r
The plot is normalized so that $y=0$ corresponds for $R_\\text{ideal}=S/(S-1)$ and $y=1$ corresponds to the bound $R_\\text{upper}=(S^2-S+1)/(S-1)^2$. Specifically normalization is\r
\r
$$\r
f_\\text{normalized}(S)=\\frac{f(S)-R_\\text{ideal}(S)}{R_\\text{upper}(S)-R_\\text{ideal}(S)}.\r
$$\r
\r
<figure>\r
\r
![Bound](./bound.png)\r
\r
</figure>`,N=()=>{let e=O.split(`./`).join(`/dev-site-misc/`),t=k.split(`./`).join(`/dev-site-misc/`),n=A.split(`./`).join(`/dev-site-misc/`),r=j.split(`./`).join(`/dev-site-misc/`),i=M.split(`./`).join(`/dev-site-misc/`);return e+``+t+n+r+i,(0,C.jsx)(_,{maxWidth:`xl`,children:(0,C.jsx)(v,{component:y,to:`/`,variant:`body1`,color:`primary`,children:`Back`})})};export{N as default};