# Linear programming
Linear programs (LP) are problems where the objective and constraint functions are all affine. A general LP has the form

$$
\begin{aligned}
\min\ &c^\top x+d\\
\text{s.t. }&Gx\leq h\\
&Ax=b
\end{aligned}\tag{1}
$$
and the *standard form* LP is written as

$$
\begin{aligned}
\min\ &c^\top x\\
\text{s.t. }&Ax=b\\
&x\geq0
\end{aligned}\tag{2}
$$

We first take a look at how to derive Problem $(2)$ from Problem $(1)$. It is trivial that $d$ can be omitted. For inequality constraints, we add *slack variables* $s_i$ such that

$$
\begin{aligned}
\min_{x,s}\ &c^\top x\\
\text{s.t. }&Gx+s=h\\
&Ax=b\\
&s\geq0
\end{aligned}
$$

Next, we express $x$ as the difference of two non-negative variables $x^+$ and $x^-$, i.e., $x=x^+-x^-$ where $x^+,x^-\succeq0$. This yields to the problem

$$
\begin{aligned}
\min_{x^+,x^-,s}\ &c^\top x^+-c^\top x^-\\
\text{s.t. }\ &Gx^+Gx^-+s=h\\
&Ax^+-Ax^-=b\\
&x^+,x^-,s\geq0
\end{aligned}
$$

At last, we combine all variables together as $z$, i.e., $z=\begin{bmatrix}x^+\\x^-\\s\end{bmatrix}$, then the problem becomes

$$
\begin{aligned}
\min_z\ &{\underbrace{\begin{bmatrix}c&-c&0\end{bmatrix}}_{\bar{c}^\top}}^\top z\\\text{s.t. }\  &\underbrace{\begin{bmatrix}A&-A&0\\G&-G&I\end{bmatrix}}_{\bar{A}}z=\underbrace{\begin{bmatrix}b\\h\end{bmatrix}}_{\bar{b}}\\&z\geq0\end{aligned}\iff\begin{aligned}\min_z\ &\bar{c}^\top z\\\text{s.t. }\  &\bar{A}z=\bar{b}\\&z\geq0\end{aligned}
$$



### Duality
Consider a linear program

$$
\begin{aligned}
\min\ &c^\top x\\
\text{s.t. }&Ax\geq b\\
&x\geq0
\end{aligned}\tag{3}
$$

The Lagrangian of Problem $(3)$ is

$$
\mathcal{L}(x,\lambda,\nu)=c^\top x+\lambda^\top (b-Ax)+\nu^\top(-x)=(c-A^\top\lambda-\nu)^\top x + \lambda^\top b
$$

The dual function is 

$$
g(\lambda,\nu)=\min_x\mathcal{L}(x,\lambda,\nu)=
\begin{cases}
b^\top\lambda&\text{if }c-A^\top\lambda-\nu=0\\
-\infty&\text{otherwise}
\end{cases}
$$

Therefore (write $\lambda$ as $y$) the Lagrange dual problem is

$$
\begin{aligned}
\max_y\ &b^\top y\\
\text{s.t. }&c=A^\top y+\nu\\
&y,\nu\geq0
\end{aligned}
$$
which is also equivalent to the following LP

$$
\begin{aligned}
\max_y\ &b^\top y\\
\text{s.t. }&A^\top y\leq c\\
&y\geq0
\end{aligned}\tag{4}
$$

One can easily verify that the dual problem of Problem $(4)$ is also Problem $(3)$. We call them *symmetric* dual problems.

**Weak duality** The objective value of Problem $(3)$ (minimization) is an upper-bound on the objective function of Problem $(4)$ (maximization), i.e., 

$$
b^\top y\leq c^\top x.
$$
**Strong duality** The duality gap is zero, i.e.,

$$
b^\top y^*= c^\top x^*.
$$


> One can verify that the dual problem of Problem $(2)$ is the following Problem $(5)$, and vice versa.

$$
\begin{aligned}
\min_x\ &c^\top x\\
\text{s.t. }&Ax=b\\
&x\geq0
\end{aligned}
\ \ \xleftrightarrow{\text{dual}}\ \ \begin{aligned}
\max_y\ &b^\top y\\
\text{s.t. }&A^\top y\leq c\\
\end{aligned}\tag{5}
$$

### Complementary slackness
**Complementary slackness Theorem** Suppose $x^*$ and $y^*$ are feasible solutions of Problem $(3)$ and Problem $(4)$, respectively. Then $x^*$ and $y^*$ are optimal solutions if and only if

$$
\begin{cases}
u_ix_i^*=0,&\forall\ i=1,\dots,n\\
v_jy_j^*=0,&\forall\ j=1,\dots,m
\end{cases}
$$
Note that the objective and constraint functions are convex, recall the KKT sufficient conditions for Problem $(3)$.

$$
\begin{aligned}
&c-A^\top \lambda-\nu=0&\text{(stationary)}\\
& Ax^*\geq b,\ x^*\geq0&\text{(primal feasibility)}\\
&\lambda\geq0,\ \nu\geq0&\text{(dual feasibility)}\\
&\lambda_i(b-Ax^*_i)=0,\ \nu_ix^*_i=0,\ i=1,\dots,n&\text{(complementary slackness)}
\end{aligned}
$$

Since $x^*$ and $y^*=\lambda$ are feasible solutions, it follows from the Lagrange dual problem that stationary condition, primal feasibility, and dual feasibility holds. Take $u_i=\nu_i$ and $v_i=b-Ax^*_i$, then complementary slackness also holds. By the KKT conditions, $x^*$ is an optimal solution of Problem $(3)$. One can verify that $y^*$ is an optimal solution of Problem $(4)$ by the same procedure.


### Simplex method
> Simplex method was invented by George Dantzig.

<span style="color:#999999">to be complete</span> 

#