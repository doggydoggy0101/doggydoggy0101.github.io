# Homogenization for Convex sets
Homogenization is a technique in convex analysis to describe convex sets as convex cones in a space one dimension higher. It follows by a homogenization method, which basically consists of three steps:

1. homogenize/conify: translate into the language of convex cones
2. work in terms of convex cones
3. dehomogenize/deconify: translate back

### Visualization of convex cones
Before we get into the homogenization techniques, we first introduce three visualization models for convex cones: the ray model, the hemisphere model, and the top-view model.

<p align="center"><img src="../docs/images/post/convex_analysis/visualization_cone.png" width="320"/></p>

The ray model visualizes a convex cone $C\in\mathbb{R}^n$ by viewing $C\backslash\{0\}$ as a set of open rays $\mathcal{R}_u=\{\rho u\mid\rho\in\mathbb{R}_{++}\}$. 

The hemisphere model visualizes $C$ by taking the intersect of $C$ with the upper unit hemisphere $\{x\in\mathbb{R}^n\mid\|x\|=1,x_n\geq0\}$.

> A subset $T$ of a sphere $S$ is called geodesically convex if for each $p,q\in T$, they are not antipodes ($p\neq-q$), and the geodesic connecting them is entirely contained in $T$.

> The hemisphere model of convex cone always geodesically convex.

The top-view model visualizes $C$ by projecting the hemisphere model onto the hyperplane of the last dimension $x_n=0$, lowering a dimension. Since the hemisphere model lies on the unit sphere, the top-view model is in a closed unit ball $\{x\in\mathbb{R}^{n-1}\mid x_1^2+\cdots+x_{n-1}^2\leq1\}$.

### Homogenize
The homogenization technique is to construct a convex cone by lifting a convex set one dimension higher. Given a convex set $A\in\mathbb{R}^n$, we lift it to $\mathbb{R}^{n+1}$ and consider the set $A\times\{1\}$. The union of all open rays that start at the origin and that run through $A\times\{1\}$ is the homogenization or conification $C$ of $A$. Also, the convex set $A$ is the dehomogenization or deconification of convex cone $C$.

<p align="center"><img src="../docs/images/post/convex_analysis/lift.png" width="240"/></p>


We give an example of a convex ellipse and its visualization of homogenization cone:

<p align="center"><img src="../docs/images/post/convex_analysis/ellipse.png" width="640"/></p>

We give an example of a convex parabola and its visualization of homogenization cone:

<p align="center"><img src="../docs/images/post/convex_analysis/parabola.png" width="640"/></p>

From the above examples, one can observe that visualization models can capture some behaviors of the convex set. For example, when the convex set is bounded (ellipse), then the top-view model lies in the interior of the unit circle. On the other hand, if the convex set is unbounded (parabola), then the top-view model will approach the boundary of the unit circle (but also not closed).

### Homogenization method

The homogenization method consists of three steps:

1. homogenize/conify: translate into the language of convex cones
2. work in terms of convex cones
3. dehomogenize/deconify: translate back

<!-- example of using the homogenization method -->
