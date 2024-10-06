# QCQP to SDP
In this note, we look at how to relax a non-convex quadratically constrained quadratic program  (QCQP) to a convex [semidefinite program](../../post/semidefinite_programming.html) (SDP). This is also known as Shor's semidefinite relaxation [[1]](#S87). Consider the QCQP:

$$
\begin{aligned}
\min_{x\in\mathbb{R}^n}\ &x^\top Cx\\
\text{s.t. }&x^\top A_ix=b_i,\ i=1,\dots,m
\end{aligned}\tag{1}
$$
where $C,A_i$ are symmetric but not neccesarily semidefinite (non-convex).

### Lagrange dual problem
Consider the Lagrangian of Problem $(1)$,

$$
\begin{aligned}
\mathcal{L}(x,\lambda)&=x^\top Cx-\sum_{i=1}^m\lambda_i(x^\top A_ix-b_i)\\
&=x^\top \Big(C-\sum_{i=1}^m\lambda_iA_i\Big)x+\sum_{i=1}^m\lambda_ib_i
\end{aligned}
$$

> We add a minus in front of the Lagrange multiplier to make $b_i$ positive, won't matter.

The dual function is 

$$
g(\lambda)=\min_x\ \mathcal{L}(x,\lambda)=
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

If $x$ is the only solution that satisfies $x^\top \Big(C-\sum_{i=1}^my_iA_i\Big)x=0$, then it is the optimal solution. Therefore, we derive a *dual optimality certifier* where we first solve the dual problem for $y^*$, and if $\text{nullity}\Big(C-\sum_{i=1}^my^*_iA_i\Big)=1$, then $y^*$ is the optimal solution of the dual problem and $x^*\in\text{null}\Big(C-\sum_{i=1}^my^*_iA_i\Big)$ is the optimal solution of Problem $(1)$.

### Rank-constrained semidefinite relaxation
We first denote a new variable $Z=xx^\top$, where $Z\succeq0$ and $\text{rank}(Z)=1$.
> Note that $x^\top Mx=\text{tr}(Mxx^\top)$.

We see immediately that Problem $(1)$ is equivalent to a rank-constrained SDP

$$
\begin{aligned}
\min_{Z\in\mathbb{S}^n}\ &\text{tr}(CZ)\\
\text{s.t. }&\text{tr}(A_iZ)=b_i,\ i=1,\dots,m\\
&Z\succeq0\\
&\text{rank}(Z)=1
\end{aligned}
$$

This problem is non-convex due to the rank-constraint (and also it is equivalent to the non-convex orignial problem). However, we can simply drop the rank-constraint and form a convex SDP

$$
\begin{aligned}
\min_{Z\in\mathbb{S}^n}\ &\text{tr}(CZ)\\
\text{s.t. }&\text{tr}(A_iZ)=b_i,\ i=1,\dots,m\\
&Z\succeq0
\end{aligned}\tag{3}
$$

> Recall from [semidefinite program](../../post/semidefinite_programming.html) that we can introduce slack variables to deal with inequalites.

We now have a *sufficient condition* for the tightness of relaxation: If $\text{rank}(Z^*)=1$, then $Z^*=x^*{x^*}^\top$ and $x^*$ is the optimal solution of Problem $(1)$.


### Dual of dual (Bidual)

The [dual SDP](../../post/semidefinite_programming.html) of Problem $(3)$ is just Problem $(2)$. If strong duality of SDP holds, we have the weak duality relation:

$$
f_{(2)}(y^*)=f_{(3)}(Z^*)\leq f_{(1)}(x^*).
$$


## Reference
<a id="S87">[1]</a> 
Shor, N. Z. (1987). Quadratic optimization problems. Soviet Journal of Computer and Systems Sciences, 25, 1-11.

[2] Yang, H. (2024). Harvard ENG-SCI 257: [Semidefinite Optimization and Relaxation](https://hankyang.seas.harvard.edu/Semidefinite/).

#
