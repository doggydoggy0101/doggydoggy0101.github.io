# QP closed-form
We present a few special cases of [quadratic program](../../post/quadratic_programming.html) (QP) that has closed-form solutions.

### QP with single equality constraint
Consider a convex QP with only one equality constraint

$$
\begin{aligned}
\min\ &\frac{1}{2}x^\top Px+q^\top x+r\\
\text{s.t. }&a^\top x=b
\end{aligned}\tag{1}
$$
where $P$ is positive definite (invertible, for later use). We first write the Lagrangian of Problem $(1)$

$$
\mathcal{L}(x,\lambda)=\frac{1}{2}x^\top Px+q^\top x+r + \lambda(a^\top x-b)
$$

Since the program is convex, the optimal solution satisfies the KKT conditions (1) first-order condition $Px^*+q+\lambda^*a^\top$ and (2) primal feasibility $a^\top x^*=b$, which we write it into matrix form as

$$
\begin{bmatrix}P&a\\a^\top&0\end{bmatrix}\begin{bmatrix}x^*\\\lambda^*\end{bmatrix}=\begin{bmatrix}-q\\b\end{bmatrix}
\implies\begin{bmatrix}x^*\\\lambda^*\end{bmatrix}=\begin{bmatrix}P&a\\a^\top&0\end{bmatrix}^{-1}\begin{bmatrix}-q\\b\end{bmatrix}.
$$
> This is also known as the KKT matrix [[1]](#BV04).

Since $P$ is invertible, denote the Schur complement of block $P$ by $s=-a^\top Pa$, and the block inversion

$$
\begin{bmatrix}P&a\\a^\top&0\end{bmatrix}^{-1}=\begin{bmatrix}P^{-1}+P^{-1}as^{-1}a^\top p^{-1}&-P^{-1}as^{-1}\\-s^{-1}a^\top P^{-1}&s^{-1}\end{bmatrix},
$$
and therefore we get the closed-forms

$$
x^*=-P^{-1}q+\frac{a^\top P^{-1}q+b}{a^\top P^{-1}a}P^{-1}a\\[8pt]
\lambda^*=-\frac{a^\top P^{-1}q+b}{a^\top P^{-1}a}
$$

> We point out that since $P$ has a special structure here, one can follow Matlab's [mldivide](https://www.mathworks.com/help/matlab/ref/mldivide.html) to use LU or Cholesky solver for solving $P^{-1}a$ and $P^{-1}q$ fast.


## Reference

<a id="BV04">[1]</a> 
S. Boyd, L. Vandenberghe, Convex optimization, Cambridge university press, 2004.
