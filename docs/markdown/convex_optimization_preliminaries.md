# Convex optimization preliminaries

Equation labels follows the textbook Convex Optimization by Boyd [[1]](#BV04).

* [Convex sets](#set)
* [Operations preserving convexity (for convex sets)](#operation1)
* [Generalized inequalities](#inequality)
* [Separating and supporting hyperplanes](#hyperplane)
* [Dual cones](#dual)
* [Convex functions](#function)
* [Operations preserving convexity (for convex functions)](#operation2)
* [Conjugate functions](#conj)
* [Quasiconvex functions](#quasi)
* [Log-convex functions](#log)
* [Convexity with respect to generalized inequalities](#general)


<a id="set"></a> 
## Convex sets

### Affine sets
Suppose $x_1\neq x_2$ are two points in $\mathbb{R}^n$,

$$
y=\theta x_1+(1-\theta)x_2
$$
is a *line*, line segment if $\theta\in\mathbb{R}$ and $\theta\in[0,1]$.

A set $C\subseteq\mathbb{R}^n$ is *affine* if for any $x_1,x_2\in C$ and $\theta\in\mathbb{R}$,

$$
\theta x_1+(1-\theta)x_2\in C.
$$

Affine combination:

$$
x=\theta_1x_1+\dots+\theta_kx_k,\ \theta_i\in\mathbb{R},\ \sum_{i=1}^k\theta_i=1
$$

> Affine set contains every affine combination of its points.

- Ex. closed sets are not affine sets
- Ex. $\mathbb{R}^2$ is an affine set
- Ex. $\{x\mid Ax=b\}$ is an affine set
> $x_1,x_2\in C,\ A(\theta x_1+(1-\theta)x_2)+b=\theta b+(1-\theta)b=b\implies\theta x_1+(1-\theta)x_2\in C$

Affine hull is the set of all affine combinations, denoted as $\mathbf{aff}\ C$:

$$
\mathbf{aff}\ C=\{\theta_1x_1+\dots+\theta_kx_k\mid x_1,\dots,x_k\in C,\ \sum_{i=1}^k\theta_i=1\}
$$
> Affine hull is the smallest affine set that contains $C$.

### Convex sets
A set $C\subseteq\mathbb{R}^n$ is *convex* if for any $x_1,x_2\in C$ and $\theta\in[0,1]$,

$$
\theta x_1+(1-\theta)x_2\in C.
$$

Convex combination:

$$
x=\theta_1x_1+\dots+\theta_kx_k,\ \theta_i\in[0,1],\ \sum_{i=1}^k\theta_i=1
$$

> Convex set contains every convex combination of its points.

Convex hull is the set of all convex combinations, denoted as $\mathbf{conv}\ C$:

$$
\mathbf{conv}\ C=\{\theta_1x_1+\dots+\theta_kx_k\mid x_1,\dots,x_k\in C,\ \sum_{i=1}^k\theta_i=1,\ \theta_i\geq0\}
$$
> Convex hull is the smallest convex set that contains $C$.

### Cones
A set $C$ is called a *cone* or *nonnegative homogeneous* if for every $x\in C$ and $\theta\geq0$,

$$
\theta x\in C.
$$

> A set $C$ is a *convex cone* if for any $x_1,x_2\in C$ and $\theta_1,\theta_2\geq0$,
> $$ \theta_1x_1+\theta_2x_2\in C.$$

Conic combination: 

$$
x=\theta_1x_1+\dots+\theta_kx_k,\ \theta_i\geq0
$$

Conic set:

$$
x_1,x_2\in C,\ \theta_1,\theta_2\geq0\implies\theta_1x_1+\theta_2x_2\in C.
$$
> Cone contains every conic combination of its points.

Conic hull:

$$
\{\theta_1x_1+\dots+\theta_kx_k\mid x_i\in C,\ \theta_i\geq0,\ i=1,\dots,k\}
$$
> Conic hull is the smallest cone that contains $C$.


### Hyperplane and halfspaces
A *hyperplane* is a set of the form:

$$
\{x\mid a^\top x=b\},\tag{2.1}
$$
where $A\in\mathbb{R}^n,a\neq0$ and $b\in\mathbb{R}$.
> Let $(n_x,n_y,n_z)^\top$ be the normal vector, with inner product: 
> 
> $$
> n_x(x-x_0)+n_y(y-y_0)+n_z(z-z_0)=0\implies a^\top x=n_xx_0+n_yy_0+n_zz_0=b
> $$

A hyperplane divides $\mathbb{R}^n$ into two *halfspaces*:

$$
\{x\mid a^\top x\geq b\},\  \{x\mid a^\top x\leq b\},\ a\in\mathbb{R}^n,a\neq0,b\in\mathbb{R}.
$$

### Euclidean balls and ellipsoids
A *(Euclidean) ball* in $\mathbb{R}^n$ has the form:

$$
B(x_c,r)=\{x\mid\|x-x_c\|_2\leq r\}=\{x_c+ru\mid\|u\|_2\leq1\}
$$
> A Euclidean ball is a convex set.

An *ellipsoid* in $\mathbb{R}^n$ has the form:

$$
\mathcal{E}=\{x\mid(x-x_c)^TP^{-1}(x-x_c)\leq1\}=\{x_c+Au\mid\|u\|_2\leq1\}\tag{2.3, 2.4}
$$
> An ellipsoid is a convex set.

### Polyhedra
A *polyhedra* is defined as the solution set of a finite number of linear equalities and inequalities:

$$
\mathcal{P}=\{x\mid \underbrace{a_j^Tx\leq b_j}_\text{inequality},j=1,\dots,m,\ \underbrace{c_j^Tx=d_j}_\text{equality},j=1,\dots,p\}=\{x\mid Ax\preceq b,\ Cx=d\},\tag{2.5, 2.6}
$$
i.e., the intersection of a finite number of halfspaces(inequality) and hyperplanes(equality).

### The positive semidefinite cone
- $\mathcal{S}^n=\{X\in\mathbb{R}^{n\times n}\mid X=X^T\}$ denote the $n\times n$ symmetric matrix.
- $\mathcal{S}^n_+=\{X\in\mathcal{S}^{n}\mid X\succeq0\}$ denote the $n\times n$ symmetric positive semidefinite matrix.
- $\mathcal{S}^n_{++}=\{X\in\mathbb{R}^{n\times n}\mid X\succ0\}$ denote the $n\times n$ symmetric positive definite matrix.
> The set $\mathcal{S}^n_+$ is a convex cone.




<a id="operation1"></a> 
## Operations preserving convexity

In order to establish a set $C$ is convex, one can directly use the definition of convex sets, or show that $C$ is obtained from simple convex sets by operations that preserve convexity. Here are some of the operations.

### Intersection
- If $S_1,S_2$ are convex, then $S_1\cap S_2$ is convex.
- If $S_\alpha$ are convex, $\alpha\in\mathcal{A}$, then $\bigcap_{\alpha\in\mathcal{A}}S_\alpha$ is convex.
- A closed convex set $S$ is the intersection of all halfspaces $\mathcal{H}$ that contains it:
  
$$
S=\bigcap\{\mathcal{H}\mid S\subseteq\mathcal{H\}}
$$

### Affine functions
Recall the definition of affine functions $f :\mathbb{R}^n\to\mathbb{R}^m,\ f(x)=Ax+b,\ A\in\mathbb{R}^{m\times n},b\in\mathbb{R}^m$.

- $S$ is convex if and only if $f(S)$ is convex.
- examples:
    - **scaling** If $S\subseteq\mathbb{R}^n$ is convex and $\alpha\in\mathbb{R}$, then $\alpha S=\{\alpha x\mid x\in S\}$ is convex.
    - **translation** If $S\subseteq\mathbb{R}^n$ is convex and $t\in\mathbb{R}^n$, then $S+t=\{x+t\mid x\in S\}$ is convex.
    - **projection** If $S\subseteq\mathbb{R}^m\times\mathbb{R}^n$ is convex, then $P=\{x\mid(x,y)\in S\}$ is convex.
    - **sum** If $S_1,S_2$ are convex, then $S_1+S_2=\{x+y\mid x\in S_1,y\in S_2\}$ is convex.
    - **Cartesian product** If $S_1,S_2$ are convex, then $S_1\times S_2=\{(x,y)\mid x\in S_1,y\in S_2\}$ is convex.


### Perspective functions
A *perspective function* is defined as $P:\mathbb{R}^{n+1}\to\mathbb{R}^n,\ \mathbf{dom}\ P=\mathbb{R}^n\times\mathbb{R}_{++},\ P(z,t)=z/t$. 

The perspective function normalizes the vector along the last component (e.g., camera coordinate $\to$  pixel coordinate).

- $S$ is convex if and only if $P(S)$ is convex.
  
### Linear-fractional
A *linear-fractional function* is defined as $L:\mathbb{R}^n\to\mathbb{R}^m$, where

$$
L(x)=\dfrac{Ax+b}{c^\top x+d}\ ;\ \ \mathbf{dom}\ L=\{x\in\mathbb{R}^n\mid c^\top x+d>0\}.\tag{2.13}
$$

The linear-fractional (projective) function is formed by composing the perspective function with an affine function.
> suppose $g:\mathbb{R}^n\to\mathbb{R}^{m+1}$ is affine given by $g(x)=\begin{bmatrix}A\\c^\top\end{bmatrix}x+\begin{bmatrix}b\\d\end{bmatrix}$,
> construct the function $f:\mathbb{R}^n\to\mathbb{R}^m$ given by $f(x)=P\circ g(x)=\frac{(Ax+b)}{(c^Tx+d)}$.

- $S$ is convex if and only if $L(S)$ is convex.




<a id="inequality"></a> 
## Generalized inequalities

### Proper cones and generalized inequalities
A cone $K\subseteq\mathbb{R}^n$ is called a *proper cone* if 
- $K$ is convex.
- $K$ is closed.
- $K$ is solid (nonempty interior).
- $K$ is pointed (contains no line).

A proper cone $K$ can be used to define *generalized inequality*, such as:
- partial order: $x\preceq_Ky\iff y\succeq_K x\iff y-x\in K$
- strict partial order: $x\prec_Ky\iff y\succ_K x\iff y-x\in \mathbf{int}(K)$

Many properties of $\preceq_K$ are similar to $\leq$ on $\mathbb{R}$:

- preserved under addition: $x\preceq_Ky$ and $u\preceq_Kv\implies x+u\preceq_Ky+v$
- transitive: $x\preceq_Ky$ and $y\preceq_Kz\implies x\preceq_Kz$
- preserved under nonnegative scalar: $x\preceq_Ky$ and $\alpha\geq0\implies\alpha x\preceq_K\alpha y$
- reflexive: $x\preceq_Kx$
- antisymmetric: $x\preceq_Ky$ and $y\preceq_Kx\implies x=y$
- preserved under limits: $x_i\preceq_Ky_i$ for $x_i\to x,y_i\to y$ as $i\to\infty\implies x\preceq_Ky$

Examples of generalized inequality ($\mathbb{R}^n_+$ and $\mathcal{S}^n_+$ are proper cones):
- vector (componentwise) inequality: $K=\mathbb{R}^n_+;\ x\preceq_{\mathbb{R}^n_+}y\iff y-x\in\mathbb{R}^n_+;\ y_i>x_i,\ \forall y_i$
- matrix inequality: $K=\mathcal{S}_+^n; x\preceq_{\mathcal{S}_+^n}y\iff y-x\in\mathcal{S}_+^n$

### Minimum and minimal elements
An equality is said to be *linear ordering* if $x,y$ are comparable, i.e., either $x\leq y$ or $x\geq y$. Generalized inequalities are not in general linear ordering, i.e., we can have $x\not\preceq_Ky$ and $y\not\preceq_Kx$ at the same time. Therefore, we introduce *minimum/maximum* and *minimal/maximal* elements:
- $x\in S$ is (unique) minimum if $\forall y\in S,\ x\preceq_Ky$.
- $x\in S$ is minimal if $\forall y\in S,\ y\preceq_Kx$ only if $y=x$.
- $x\in S$ is (unique) maximum if $\forall y\in S,\ x\succeq_Ky$.
- $x\in S$ is maximal if $\forall y\in S,\ y\succeq_Kx$ only if $y=x$.

set notations:
- $x\in S$ is minimum if and only if $S\subseteq x+K$.
- $x\in S$ is minimal if and only if $(x-K)\cap S=\{x\}$.

For $K=\mathbb{R}_+$, minimal and minimum are the same. We show some examples for $K=\mathbb{R}^2_+$:

<p align="center"><img src="../docs/images/post/convex_optimization/min.png" width="500"/></p>

<a id="hyperplane"></a> 
## Separating and supporting hyperplanes

### Separating hyperplane Theorem
Suppose $C$ and $D$ are nonempty disjoint convex sets, i.e., $C\cap D=\emptyset$. Then there exist $a\neq0$ and $b$ such that $a^\top x\leq b$ forall $x\in C$ and $a^\top x\geq b$ forall $x\in D$. In other words, the affine function $a^\top x−b$ is nonpositive on $C$ and nonnegative on $D$. The hyperplane $\{x\mid a^\top x=b\}$ is called a separating hyperplane for the sets $C$ and $D$.
<p align="center"><img src="../docs/images/post/convex_optimization/separate.png" width="300"/></p>

A separating hyperplane is called *strict separation* of the sets $C$ and $D$ if $a^\top x<b$ forall $x\in C$ and $a^\top x>b$ for all $x\in D$. Disjoint convex sets (even closed sets) need not be strictly separable. For example, $C=\{(x,y)\mid x\leq0\}$ and $D=\{(x,y)\mid xy\geq1, x>,y>0\}$:
<p align="center"><img src="../docs/images/post/convex_optimization/separate_converse.png" width="320"/></p>

The converse of the separating hyperplane theorem is not true. For example, hyperplane $x=0$ separates $C=D=\{0\}$, but $C$ and $D$ are not disjoint convex sets.

However, we can add various conditions such that the converse of separating hyperplane is true. For example, any two convex sets $C$ and $D$, with at least one of which is open, are disjoint if and only if there exists a separating hyperplane.

### Supporting hyperplanes
Suppose $C\subseteq\mathbb{R}^n$ and $x_0$ is a point in its boundary $\mathbf{bd}\ C$. If $a\neq0$ satisfies $a^\top x\leq a^\top x_0$ for all $x\in C$, then the hyperplane $\{x\mid a^\top x=b\}$ is called a *supporting hyperplane* to $C$ at point $x_0$.

This is equivalent to saying that $x_0$ and $C$ is separated by the hyperplane $\{x\mid a^\top x=a^\top x_0\}$.
<p align="center"><img src="../docs/images/post/convex_optimization/support.png" width="240"/></p>

**Supporting hyperplane Theorem**
For any nonempty convex set $C$ and $x_0\in\mathbf{bd}\ C$, there exists a supporting hyperplane to $C$ at $x_0$.

**Converse of supporting hyperplane Theorem**
If a set is closed, has nonempty interior, and has a supporting hyperplane at every boundary point, then it is convex.


<a id="dual"></a> 
## Dual cones 

- cone $K=\{x\mid\theta x\in K, \theta\geq0\}$
- dual cone $K^*=\{y\mid x^\top y\geq0,\ \forall x\in K\}$

Dual cone is always convex, even when the original cone is not. Similar to dual problem is always convex, even when the primal problem is not. We list some (self-dual) examples:
- $K=\mathbb{R}_+^n\implies K^*=\mathbb{R}_+^n$ 
> $x^\top y\geq0,\ \forall x\succeq0\iff y\succeq0$
- $K=\mathcal{S}^n_+=\{X\in\mathcal{S}^n\mid z^\top Xz\geq0,\ z\in\mathbb{R}^n\}\implies K^*=\{Y\mid\text{tr}(XY)\geq0,\ X\in\mathcal{S}^n\}$
> $\text{tr}(XY)\geq0,\ \forall X\succeq0\iff Y\succeq0$

Properties:
- $K^*$ is closed and convex
- $K_1\subseteq K_2\implies K^*_2\subseteq K^*_1$
- $K$ has nonempty interior $\implies K^*$ is pointed
- closure of $K$ is pointed $\implies K^*$ has nonempty interior
- $K^{**}=\mathbf{cl}(\mathbf{conv}(K))$ (if $K$ is convex, $K^{**}=K$)
- $K$ is a proper cone $\implies K^*$ is a proper cone, i.e., $K^{**}=K$

### Dual generalized inequalities
Since dual cones of proper cones are also proper cones, they define generalized inequalities as well.


- $x\preceq_Ky\iff \lambda^\top x\leq\lambda^\top y,\ \forall \lambda\succeq_{K^*}0$
- $x\prec_Ky\iff \lambda^\top x<\lambda^\top y,\ \forall \lambda\succeq_{K^*}0,\ \lambda\neq0$

**Dual characterization of minimum** Recall that $x\in S$ is (unique) minimum if $\forall y\in S,\ x\preceq_Ky$.
- $x\in S$ is minimum $\iff\forall\lambda\succ_{K^*}0$, $x$ is the unique minimizer of $\lambda^\top z$ over $z\in S$
- $\forall\lambda\succ_{K^*}0$, the hyperplane $\{z\mid\lambda^\top(z-x)=0\}$ is a strict supporting hyperplane to $S$ at $x$

**Dual characterization of minimal** Recall that $x\in S$ is minimal if $\forall y\in S,\ y\preceq_Kx$ only if $y=x$.
- $\lambda\succ_{K^*}0$ and $x$ minimized $\lambda^\top z$ over $z\in S\implies x$ is minimal
> Converse is false, e.g., minimal but not minimizer.





<a id="function"></a> 
## Convex functions

A function $f:\mathbb{R}^n\to\mathbb{R}$ is convex if $\mathbf{dom}\ f$ is a convex set and if for all $x,y\in\mathbf{dom}\ f$, and $\theta$ with $0\leq\theta\leq1$, we have

$$
f(\theta x+(1-\theta)y)\leq\theta f(x)+(1-\theta)f(y).\tag{3.1}
$$
> Any line segment between two points lies above the graph.

- $-f$ is concave *(we will only focus on convex properties in this note)*
- affine is both convex and concave $f(\theta x+(1-\theta)y)=\theta f(x)+(1-\theta)f(y)$

We list some examples of convex function:
- $f(x)=a^\top x+b$
- $f(x)=\text{tr}(A^Tx)+b$
- $f(x)=\exp(x)$
- $f(x)=x\log(x)$
- $f(x) = 1/x,\ x>0$
- $f(x)=\|x\|_p=(\sum_{i=1}^n|x_i|^p)^\frac{1}{p},\ p\geq1$

> For all $x\in\mathbf{dom}\ f,v\in\mathbb{R}^n,\ g(t)=f(x+tv)$ is convex if and only if $f(x)$ is convex.

### Extended-value extension
It is usually convenient to extend the feasible of a convex function to $\mathbb{R}^n$, we define an *extended-value extension* that is also convex so that we do not need to explicitly describe the domain.

$$
\tilde{f}:\mathbb{R}^n\to\mathbb{R}\cup\{\infty\},\ \ \ \tilde{f}(x)=
\begin{cases}f(x)&x\in\mathbf{dom}\ f\\ \infty&x\notin\mathbf{dom}\ f\end{cases}
$$

### First-order conditions
Suppose $f$ is *differentiable*, then $f$ is convex if and only if $\mathbf{dom}\ f$ is convex and for all $x,y\in\mathbf{dom}\ f$,

$$
f(y)\geq f(x)+\nabla f(x)^\top(y-x).\tag{3.2}
$$
> We prove the 1-dimensional case "$f:\mathbb{R}\to\mathbb{R}$ is convex$\iff f(y)\geq f(x)+f^\prime(x)(y-x)$".
> 
> > Assume $f$ is convex, then for $t\in(0,1]$,
> >
> > $$
> > \begin{aligned}
> > &f\big((1-t)x+ty\big)\leq (1-t)f(x)+tf(y)\\[8pt]
> > \implies\ &tf(y)-tf(x)\geq f\big(x+t(y-x)\big)-f(x)\\
> > \implies\ &f(y)-f(x)\geq\frac{f\big(x+t(y-x)\big)-f(x)}{t}
> > \end{aligned}
> > $$
> > Since the RHS goes smaller if $t\to1$, therefore we only care if the inequality holds when $t\to0$.
> >
> > $$
> > \lim_{t\to0}\frac{f\big(x+t(y-x)\big)-f(x)}{t}=\lim_{t\to0}\frac{f\big(x+t(y-x)\big)-f(x)}{t(y-x)}(y-x)=f^\prime(x)(y-x)
> > $$
> > Thus we get $f(y)\geq f(x)+\nabla f(x)^\prime(y-x)$ when $t\to0$.
>
> > Choose $x\neq y$ and $\theta\in[0,1]$ such that $z=\theta x+(1-\theta)y$. Applying the first-order condition, we have
> >
> > $$
> > f(x)\geq f(z)+f^\prime(z)(x-z)\ ,\ \ f(y)\geq f(z)+f^\prime(z)(y-z).
> > $$
> > Multiplying the first inequality by $\theta$ and the second inequality by $(1-\theta)$,
> >
> > $$
> > \begin{aligned}
> > \theta f(x) + (1-\theta) f(y)&\geq \theta\big(f(z)+f^\prime(z)(x-z)\big)+(1-\theta)\big(f(z)+f^\prime(z)(y-z)\big)\\[4pt]
> > &=f(z)+ \theta f^\prime(z)x+(1-\theta)f^\prime(z)y-\theta f^\prime(z)z-(1-\theta)f^\prime(z)z\\[4pt]
> > &=f(z) + f^\prime(z)z - f^\prime(z)z =f(z)
> > \end{aligned}
> > $$
> > Thus $f$ is convex.

### Second-order conditions
Suppose $f$ is *twice differentiable*, i.e., Hessian $\nabla^2f$ exists, then $f$ is convex if and only if $\mathbf{dom}\ f$ is convex and for all $x\in\mathbf{dom}\ f$, its Hessian is positive semidefinite:

$$
\nabla^2f(x)\succeq0.
$$
We list some examples that are easy to verify convexity by second-order condition:
- quadratic function: $f(x)=\frac{1}{2}x^\top Px+q^\top x+r,\ \nabla f(x)=Px+q,\ \nabla^2f(x)=P$, thus $f$ is convex if and only if $P$ is positive semidefinite.
- least squares: $f(x)=\|Ax-b\|^2_2,\ \nabla f(x)=2\|Ax-b\|\frac{A^\top(Ax-b)}{\|Ax-b\|}=2A^\top(Ax-b),\ \nabla^2f(x)=2A^\top A$, thus least squares are always convex.

### Sublevel sets
The $t$-sublevel sets of a convex function $f:\mathbb{R}^n\to\mathbb{R}$ is defined as $S_t=\{x\in\mathbf{dom}\ f\mid f(x)\leq t\}$. Sublevel sets of a convex function are convex for any value $t$. 
<p align="center"><img src="../docs/images/post/convex_optimization/sublevel.png" width="240"/></p>

### Epigraph

The graph of a function $f:\mathbb{R}^n\to\mathbb{R}$ is defined as $\{(x,f(x))\mid x\in\mathbf{dom}\ f\}$, which is a subset of $\mathbb{R}^{n+1}$. The *epigraph* of a function $f:\mathbb{R}^n\to\mathbb{R}$ is defined as $\mathbf{epi}\ f=\{(x,t)\mid x\in\mathbf{dom}\ f,\ f(x)\leq t\}\subseteq\mathbb{R}^{n+1}$. A function is convex if and only if its epigraph is a convex set.

<a id="operation2"></a> 
## Operations that preserve convexity

In order to establish a function $f$ is convex, one can directly use the definition of convex functions, or show that $f$ is obtained from simple convex functions by operations that preserve convexity. Here are some of the operations.

- $f$ is convex$\implies\alpha f(x),\ \alpha\geq0$  is convex
- $f_i$ are convex$\implies\sum f_i(x)$ is convex
- $f_i$ are convex, $w_i$ are nonnegative$\implies\sum w_i f_i(x)$ is convex
- $f$ is convex, $g$ is affine $\implies f(g(x))$ is convex
- $f_i$ are convex$\implies\max(f_1(x),\dots,f_n(x))$  is convex
- $f(x,y)$ is convex, $y\in\mathcal{A}\implies\sup_{y\in\mathcal{A}}f(x,y)$ is convex

### Composition
Suppose $g:\mathbb{R}^n\to\mathbb{R}^k,\ h:\mathbb{R}^k\to\mathbb{R}$, the compostion $f=h\circ g:\mathbb{R}^n\to\mathbb{R}$ is defined by

$$
f(x)=h(g(x))\ ;\ \ \mathbf{dom}\ f=\{x\in\mathbf{dom}\ g\mid g(x)\in\mathbf{dom}\ h\}.
$$

**scalar composition** ($k=1$)

$$
f^{\prime\prime}(x)=h^{\prime\prime}(g(x))\underbrace{[g^\prime(x)]^2}_{\geq0}+g^{\prime\prime}(x)h^\prime(g(x)).\tag{3.9}
$$
> In order to make $f$ convex, we need $f^{\prime\prime}\geq0$ (second-order conditions). By $(3.9)$, we need $h^{\prime\prime}\geq0$ and both $h^\prime,g^{\prime\prime}\geq0$ or $\leq0$.

- $f$ is convex if $h$ is convex ($h^{\prime\prime}\geq0$) and nondecreasing, and $g$ is convex ($g^{\prime\prime},h^\prime\geq0$)
- $f$ is convex if $h$ is convex ($h^{\prime\prime}\geq0$) and nonincreasing, and $g$ is concave ($g^{\prime\prime},h^\prime\leq0$)

**vector composition** ($k\geq1$)

$$
f^{\prime\prime}(x)=g^\prime(x)^\top\nabla^2h(g(x))g^\prime(x)+\nabla h(g(x))^\top g^{\prime\prime}(x).\tag{3.15}
$$

- $f$ is convex if $h$ is convex, $h$ is nondecreasing in each argument, and $g_i$ are convex
- $f$ is convex if $h$ is convex, $h$ is nonincreasing in each argument, and $g_i$ are concave

###  Minimization
We have seen that maximum or supremum of convex functions is convex. We now consider a speical form of minimization

$$
g(x)=\inf_{y\in C}f(x,y)\tag{3.16}
$$
is convex if $g(x)>-\infty$ for all $x$.

For example, given a convex function $f(x,y)=x^\top Ax+2x^\top By+y^\top Cy$ with $\begin{pmatrix}A&B\\B^\top&C\end{pmatrix}\succeq0$ and $C\succeq0$. By setting the derivative of $f(x,y)$ with respective to $y$ to 0, we get $y=C^{-1}B^\top x$, the minimization

$$
\begin{aligned}
g(x)=\inf_{y}f(x,y)&=x^\top Ax+2x^\top B(C^{-1}B^\top x)+(C^{-1}B^\top x)^\top C(C^{-1}B^\top x)\\
&=x^\top Ax-2x^\top BC^{-1}B^\top x+x^\top BC^{-1}B^\top x\\
&=x^\top(A-BC^{-1}B^\top)x
\end{aligned}
$$
By Schur complement, $C\succeq0$ and $\begin{pmatrix}A&B\\B^\top&C\end{pmatrix}\succeq0$ implies $A-BC^{-1}B^\top\succeq0$, therefore $g$ is convex.

### Perspective of a function
If $f:\mathbb{R}^n\to\mathbb{R}$, then the *perspective* of $f$ is the function $g:\mathbb{R}^{n+1}\to\mathbb{R}$ defined by

$$
g(x,t)=tf(x/t)\ ;\ \ \mathbf{dom}\ g=\{(x,t)\mid x/t\in\mathbf{dom} f,\ t>0\}.
$$

If $f$ is convex, then $g$ is convex. We give a short proof using epigraph and the perspective function of $\mathbb{R}^{n+1}$. For $t>0$, we have

$$
\begin{aligned}
(x,t,s)\in\mathbf{epi}\ g&\iff tf(x/t)\leq s\\
&\iff f(x/t)\leq s/t\\ 
&\iff(x/t, s/t)\in\mathbf{epi}\ f
\end{aligned}
$$
Since $f$ is convex$\iff\mathbf{epi}\ f$ is convex, we have $g$ is convex$\iff\mathbf{epi}\ g$ is convex.



<a id="conj"></a> 
## Conjugate function
Let $f:\mathbb{R}^n\to\mathbb{R}$, then $f^*:\mathbb{R}^n\to\mathbb{R}$ is the *conjugate* of $f$ defined by

$$
f^*(y)=\sup_{x\in\mathbf{dom}\ f}\big(y^\top x-f(x)\big).\tag{3.18}
$$

We immediately see that $f^*$ is convex since it is the supremum of affine function of $y$, whether $f$ is convex or not. For example given an affine function $f(x)=ax+b$,

$$
f^\*(y)=\sup_{x\in\mathbb{R}}\big(yx-(ax+b)\big)=\sup_{x\in\mathbb{R}}\big((y-a)x-b\big)=\begin{cases}-b&\text{if }y=a\\\infty&\text{if }y\neq a\end{cases}
$$

For 1-dimensional case, conjugate function tries to find the maximum distance between $yx$ and $f(x)$. A nice demonstration can be found here: [Fenchel conjugate function demo](https://youtu.be/zkesU2jMkCg).
<p align="center"><img src="../docs/images/post/convex_optimization/conjugate.png" width="280"/></p>

**Fenchel’s inequality** By $(3.18)$, we obtain the *Fenchel's inequality*

$$
f(x)+f^*(y)\geq y^\top x.
$$

**Conjugate of the conjugate** If $f$ is convex and closed, i.e., $\mathbf{epi}\ f$ is a closed convex set, then $f^{**}=f$, i.e., the conjugate of conjugate of $f$ is $f$ itself.

**Differetiable functions** If $f$ is differentiable, then the conjugate of $f$ is also called the *Legendre transform* of $f$. Suppose $f$ is convex and differetiable, the maximizer $x^*$ must satisfy the first-order condition. Take the derivatives if $y^\top x^*-f(x^*)$ to zero, we get $y=\nabla f(x^*)$. Therefore, if $y=\nabla f(x)$, we have a closed-form to compute the conjugate function

$$
f^*(y)=\nabla f(x)^\top x-f(x).
$$



<a id="quasi"></a> 
## Quasiconvex functions

A function $f:\mathbb{R}^n\to\mathbb{R}$ is called *quasiconvex* if all its sublevel sets are convex.
<p align="center"><img src="../docs/images/post/convex_optimization/quasiconvex.png" width="640"/></p>

We could also characterize quasiconvexity like the definition of convex function: A function $f$ is quasiconvex if $\mathbf{dom}\ f$ is convex and if for all $x,y\in\mathbf{dom}\ f$, and $\theta$ with $0\leq\theta\leq1$, we have

$$
f(\theta x+(1-\theta)y)\leq\max\{f(x),f(y)\}.\tag{3.19}
$$

> Points between the line segmant cannot be larger than the $\max\{f(x),f(y)\}$-level.

### Differentiable quasiconvex functions
**First-order conditions** Suppose $f:\mathbb{R}^n\to\mathbb{R}$ is differentiable, then $f$ is quasiconvex if and only if $\mathbf{dom}\ f$ is convex and for all $x,y\in\mathbf{dom}\ f$,

$$
f(y)\leq f(x)\implies\nabla f(x)^\top(y-x)\leq0.\tag{3.20}
$$

**Second-order conditions** Suppose $f:\mathbb{R}^n\to\mathbb{R}$ is twice differentiable. If $f$ is quasiconvex, then if $\mathbf{dom}\ f$ is convex and all $y\in\mathbb{R}^n$, we have

$$
y^\top\nabla f(x)=0\implies y^\top\nabla^2f(x)y\geq0.\tag{3.21}
$$

### Operations that preserve quasiconvexity

- $f_i$ are quasiconvex$\implies\max(f_1(x),\dots f_k(x))$ is quasiconvex
- $f_i$ are quasiconvex,  $w_i$ are nonnegative$\implies\max(w_1f_1(x),\dots w_kf_k(x))$ is quasiconvex
- $g:\mathbb{R}^n\to\mathbb{R}$ is quasiconvex, $h:\mathbb{R}\to\mathbb{R}$ is nondecreasing$\implies f=h\circ g$ is quasiconvex
- $f$ is quasiconvex, $y\in C\implies g(x)=\inf_{y\in C}f(x,y)$ is quasiconvex
- sum of quasiconvex functions is not necessary quasiconvex


<a id="log"></a> 
## Log-convex functions

A function $f:\mathbb{R}^n\to\mathbb{R}$ is log-convex if $f(x)>0$ for all $x\in\mathbf{dom}\ f$ and $\log\ f$ is convex. We also write log-convexity like the definition of convex function: a function $f:\mathbb{R}^n\to\mathbb{R}$ with convex domain and $f(x)>0$ for all $x\in\mathbf{dom}\ f$ is log-convex if and only if for all $x,y\in\mathbf{dom}\ f$ and $0\leq\theta\leq1$,

$$
f(\theta x+(1-\theta)y)\leq f(x)^\theta f(y)^{(1-\theta)}.
$$
> $$\log f(\theta x+(1-\theta)y)\leq\theta\log f(x)+(1-\theta)\log f(y).$$

**Second-order conditions** $f$ is log-convex if and only if for all $x\in\mathbf{dom}\ f$,

$$
f(x)\nabla^2f(x)\succeq\nabla f(x)\nabla f(x)^\top.
$$

<a id="general"></a> 
## Convexity with respect to generalized inequalities

Suppose that $K\subseteq\mathbb{R}^n$ is a proper cone with associated generalized inequality $\succeq_K$.
### Monotonicity with respect to generalized inequality
- $f:\mathbb{R}^n\to\mathbb{R}$ is $K$-nondecreasing if $x\preceq_Ky\implies f(x)\leq f(y)$
- $f:\mathbb{R}^n\to\mathbb{R}$ is $K$-nonincreasing if $x\succeq_Ky\implies f(x)\geq f(y)$
- $f:\mathbb{R}^n\to\mathbb{R}$ is $K$-increasing if $x\preceq_Ky,x\neq y\implies f(x)<f(y)$
- $f:\mathbb{R}^n\to\mathbb{R}$ is $K$-decreasing if $x\succeq_Ky,x\neq y\implies f(x)>f(y)$

**Gradient conditions for monotoncity** Recall that a differentialbe function $f:\mathbb{R}\to\mathbb{R}$ with convex domain is nondecreasing if and only if $f^\prime(x)\geq0$ for all $x\in\mathbf{dom}\ f$. This can also be extended to generalized inequalities:
- $\nabla f(x)\succeq_{K^*}0\iff f$ is $K$-nondecreasing
- $\nabla f(x)\preceq_{K^*}0\iff f$ is $K$-nonincreasing
- $\nabla f(x)\succ_{K^*}0\implies f$ is $K$-increasing
- $\nabla f(x)\prec_{K^*}0\implies f$ is $K$-decreasing

### Convexity with respect to a generalized inequality
A function $f:\mathbb{R}^n\to\mathbb{R}^m$ is $K$-convex if for all $x,y\in\mathbf{dom}\ f$ and $0\leq\theta\leq1$,

$$
f(\theta x+(1-\theta)y)\preceq_K\theta f(x)+(1-\theta)f(y).
$$

**First-order conditions** A differentiable function $f$ is $K$-convex if and only if its domain is convex and for $x,y\in\mathbf{dom}\ f$,

$$
f(y)\succeq_Kf(x)+Df(x)(y-x).
$$

> These definitions reduce to ordinary convexity when $m=1$ and $K=\mathbb{R}_+$.


## Reference
<a id="BV04">[1]</a> 
S. Boyd, L. Vandenberghe, Convex optimization, Cambridge university press, 2004.

[2] Bazaraa, M. S., Sherali, H. D., & Shetty, C. M. (2006). Nonlinear programming: theory and algorithms. John wiley & sons.

[3] Zhang, S. (2020). UMN IE 8521: Optimization.


#