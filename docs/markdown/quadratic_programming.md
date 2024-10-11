# Quadratic programming
Quadratic programs (QP) are problems where the objective function is *quadratic* and the constraint functions are affine. A (standard) quadratic program is in the form

$$
\begin{aligned}
\min\ &\frac{1}{2}x^\top Px+q^\top x+r\\
\text{s.t. }&Ax=b
\end{aligned}\tag{1}
$$
> Note that we could introduce slack variables to make inequality affine constraints to equality (shown [here](../../post/linear_programming.html)).

Another well-studied class of problems is when the constraints are also quadratic, which is called a quadratically constrained quadratic program (QCQP)

$$
\begin{aligned}
\min\ &\frac{1}{2}x^\top P_0x+q_0^\top x+r_0\\
\text{s.t. }&\frac{1}{2}x^\top P_ix+q_i^\top x+r_i,\ i=1,\dots,m\\
&Ax=b
\end{aligned}\tag{2}
$$

> Geometrically, the (inequality) affine constraints of Problem $(1)$ is a polyhedra (intersect of halfspaces), and the quadratic constraints of Problem $(2)$ is the intersect of ellipsoids.


### Duality
Consider the Lagrangian of Problem $(1)$

$$
\begin{aligned}
\mathcal{L}(x,\lambda)&=\frac{1}{2}x^\top Px+q^\top x + r-\lambda^\top(Ax-b)\\
&=\frac{1}{2}x^\top Px+(q-A^\top\lambda)^\top x+(b^\top\lambda+r)
\end{aligned}
$$

By the KKT conditions, we have the first-order condition that

$$
\frac{\partial}{\partial x}\mathcal{L}(x,\lambda)=Px+q-A^\top\lambda=0\implies Px=A^\top\lambda-q,
$$
that is, if $(A^\top\lambda-q)$ is in the column space of $P$ and $x^*=P^{-1}(A^\top\lambda-q)$, we get the dual function

$$
g(\lambda)=\min_x\mathcal{L}(x,\lambda)=\begin{cases}(b^\top\lambda+r)-\frac{1}{2}(A^\top\lambda-q)^\top P^{-1}(A^\top\lambda-q)&\text{if }(A^\top\lambda-q)\in \text{C}(P)\\ -\infty&\text{otherwise}\end{cases}
$$
therefore, the dual problem is

$$
\begin{aligned}
\max\ &b^\top\lambda+r-\frac{1}{2}(A^\top\lambda-q)P^{-1}(A^\top\lambda-q)\\
\text{s.t. }&(A^\top\lambda-q)\in \text{C}(P)
\end{aligned}\tag{2}
$$

### QCQP to SOCP
Convex QCQPs are a special case of second-order cone programs (SOCP). Most QCQPs are more computationally efficient solve the corresponding SOCPs, and duality theory (including infeasibility certificates) is much simpler for SOCPs. Please refer to this [note](../../post/qp_to_cqp.html) for more details.

### QCQP to SDP
Convex QCQPs are also equivalent to semidefinite programs (SDP). Furthermore, we could also reformulate non-convex QCQPs to convex SDPs by Lagrange dual or rank relaxation, along with dual feasible certificates or suffucient condition for the tightness of rank relaxation, respectively. Please refer to this [note](../../post/qcqp_to_sdp.html) for more details.


## Reference
[1] S. Boyd, L. Vandenberghe, Convex optimization, Cambridge university press, 2004.
