# Semidefinite programming
This is a brief introduction to semidefinite program (SDP). SDPs are like [linear programs](../../post/linear_programming.html) (LP), but instead with positive semidefinite matrices as variable. I will suggest one learn the basic concepts of LP before going on. Analogously to linear programming, the *standard form* of SDP is given as 

$$
\begin{aligned}
\min_{X\in\mathbb{S}^n}\ &\langle C,X\rangle\\
\text{s.t. }\ &\langle A_i,X\rangle=b_i,\ i=1,\dots,n\\
&X\succeq0
\end{aligned}\tag{1}
$$

> Note that $\langle C,X\rangle=\text{tr}(C^\top X)$, SDP are sometimes written as

$$
\begin{aligned}
\min_{X\in\mathbb{S}^n}\ &\text{tr}(C^\top X)\\
\text{s.t. }\ &\text{tr}(A_i^\top X)=b_i,\ i=1,\dots,n\\
&X\succeq0
\end{aligned}
$$

Similar to LP, if we have inequality constraints in Problem $(1)$, we can add *slack variables* to form an equivalent SDP with equality constraints only.

### Dual SDP
Consider the Lagrangian of Problem $(1)$,

$$
\begin{aligned}
\mathcal{L}(X,\lambda)&=\langle C,X\rangle-\sum_{i=1}^n\lambda_i(\langle A_i,X\rangle-b_i)\\
&=\langle C,X\rangle-\sum_{i=1}^n\lambda_i\langle A,X\rangle_i+\sum_{i=1}^n\lambda_ib_i
\end{aligned}
$$
> We add a minus in front of the Lagrange multiplier to make $b_i$ positive, won't matter.

The dual function is 

$$
g(\lambda)=\min_X\ \mathcal{L}(X,\lambda)=
\begin{cases}
\sum_{i=1}^n\lambda_ib_i&\text{if }C-\sum_{i=1}^n\lambda_iA_i \succeq0\\
-\infty&\text{otherwise}
\end{cases}
$$

Therefore (write $\lambda$ as $y$) the Lagrange dual problem is

$$
\begin{aligned}
\max_y\ &\sum_{i=1}^nb^\top y\\
\text{s.t. }&\sum_{i=1}^ny_iA_i \preceq C
\end{aligned}\tag{2}
$$


**Weak duality** Let $X$ and $y$ be a feasible solution of Problem $(1)$ and Problem $(2)$, respectively, then 

$$
b^\top y\leq\langle C,X\rangle.
$$

**Strong duality** Let $X^*$ and $y^*$ be the optimal solution of Problem $(1)$ and Problem $(2)$, respectively. If both problems are strictly feasible, i.e., $X\succ0$ and $\sum_{i=1}^ny_iA_i \prec C$, then 

$$
b^\top y^*=\langle C,X^*\rangle.
$$

> Strictly feasible implies feasible set has interior point, which is also the *Slater's condition*.

### Interior point method

<span style="color:#999999">to be complete</span> 



## Reference
<!-- <a id="VB96">[1]</a>  -->
[1] Vandenberghe, L., & Boyd, S. (1996). Semidefinite programming. SIAM review, 38(1), 49-95.
