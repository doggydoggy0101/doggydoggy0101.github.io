# QCQP to SOCP
Convex quadratically constrained quadratic programs (QCQP) are a special case of second-order cone programs (SOCP). Most QCQPs are more computationally efficient solve the corresponding SOCPs, and duality theory (including infeasibility certificates) is much simpler for SOCPs. In this note, we take at how to formulate SOCP from a convex QCQP.

### Quadratic constraint to second-order cone constraint
We first show that *a convex quadratic constraint is equivalent to a second-order cone constraint*. 

$$
\frac{1}{2}x^\top Px+q^\top x+r\leq0\iff\|Ax+b\|\leq c^\top x+d
$$

If $P=A^\top A$ is positive definite,

$$
\begin{aligned}
\frac{1}{2}x^\top Px+q^\top x+r\leq0
&\iff x^\top Px+2q^\top x\leq-2r\\
&\iff x^\top A^\top Ax+2{\underbrace{(A^\top b)}_{q}}^\top x\leq-2r\\
&\iff x^\top A^\top Ax+2(A^\top b)^\top x+b^\top b\leq b^\top b-2r\\
&\iff\|Ax+b\|\leq(b^\top b-2r)^\frac{1}{2}
\end{aligned}
$$

> Note that we need to solve $b=A^{-\top}q$, which requires $P$ to be positive definite.

If $P=A^\top A$ is positive semidefinite,

$$
\begin{aligned}
\frac{1}{2}x^\top Px+q^\top x+r\leq0
&\iff x^\top Px\leq\underbrace{-2q^\top x-2r}_{t}\\
&\iff x^\top A^\top Ax+\frac{-2t}{4}\leq\frac{2t}{4}\\
&\iff x^\top A^\top Ax+\frac{t^2-2t+1}{4}\leq\frac{t^2+2t+1}{4}\\
&\iff\begin{Vmatrix}
Ax\\\frac{t-1}{2}
\end{Vmatrix}\leq\frac{t+1}{2}\\
&\iff\begin{Vmatrix}\begin{pmatrix}A\\-q^\top\end{pmatrix}x+\begin{pmatrix}0\\-r-\frac{1}{2}\end{pmatrix}\end{Vmatrix}\leq-q^\top x+(-r+\frac{1}{2})
\end{aligned}
$$

### Quadratically constrained quadratic programming
Consider a QCQP

$$
\begin{aligned}
\min\ &\frac{1}{2}x^\top P_0x+q_0^\top x+r_0\\
\text{s.t. }&\frac{1}{2}x^\top P_ix+q_i^\top x+r_i,\ i=1,\dots,m\\
&Fx=g
\end{aligned}\tag{1}
$$
> Note that we could introduce slack variables to make inequality affine constraints to equality (shown [here](../../post/linear_programming.html)).

We first introduce an upper bound variable $t$ and rewrite Problem $(1)$ with affine objective and quadratic constraints

$$
\begin{aligned}
\min\ &t\\
\text{s.t. }&\frac{1}{2}x^\top P_0x+q_0^\top x+r_0\leq t\\
&\frac{1}{2}x^\top P_ix+q_i^\top x+r_i,\ i=1,\dots,m\\
&Fx=g
\end{aligned}
$$

Then by the previous section, we can write Problem $(1)$ as a SOCP:

$$
\begin{aligned}
\min\ &t\\
\text{s.t. }&\begin{Vmatrix}\begin{pmatrix}A_0\\-q_0^\top\end{pmatrix}x+\begin{pmatrix}0\\-r_0+t-\frac{1}{2}\end{pmatrix}\end{Vmatrix}\leq-q_0^\top x+(-r_0+t+\frac{1}{2})\\
&\begin{Vmatrix}\begin{pmatrix}A_i\\-q_i^\top\end{pmatrix}x+\begin{pmatrix}0\\-r_i-\frac{1}{2}\end{pmatrix}\end{Vmatrix}\leq-q_i^\top x+(-r_i+\frac{1}{2})\\
&Fx=g
\end{aligned}
$$



## Reference

[1] S. Boyd, L. Vandenberghe, Convex optimization, Cambridge university press, 2004.

[2] ApS, M. (2020). Mosek modeling cookbook.
