# Point cloud registration


Point cloud registration is a well-knowned problem in robotics and computer vision. Suppose that we have two sets of 3D point clouds, we want to find a spactial transformation between the two point clouds, for example, a rotation matrix or a translation vector.

<p align="center"><img src="../docs/images/post/point_cloud_registration/bunny.png" width="540"/></p>

Here is a quick example, the left figures are the input data, and we are using the darker red and blue points, while the lighter points are only for visualization purpose. Both blue and red point clouds has 100 points with 80 percent of them are ouliters. What we are trying to do here is to align the darker blue points onto the darker red points, where there are a lot of mis-information. 

## Problem statement

Lets write it into equations. Again, suppose that we two sets of 3D point clouds $\{a_i\}_{i=1}^n$ and $\{b_i\}_{i=1}^n$ , we multiply a rotation $R\in\text{SO}(3)$ onto $a_i$, and add a translation $t\in\mathbb{R}^3$ onto it, then idealy $b_i\approx Ra_i+t$. The objective of point cloud registration is the least squares

$$
\min_{R\in\text{SO(3)},t\in\mathbb{R}^3}\sum_{i=1}^n\|b_i-(Ra_i+t)\|^2
\iff
\min_{X\in\text{SE}(3)}\sum_{i=1}^n\|\bar{b}_i-X\bar{a}_i\|^2,\tag{1}
$$
> Could also be a weighted least squares if we consider the Gaussian distributed error into the model. 

where $\bar{a}_i,\bar{b}_i$ are homogeneous coordinates.

> Horn [[1]](#H87) proposed a *closed-form* solution for Problem $(1)$ by decoupling the problem to rotation and translation sub-problems (and also assume that there is no noise in the model). Decouple approaches [[2]](#CTD15)  typically first solves the rotation estimation problem by omitting the translation, and after we get a estimated rotation, the original problem becomes the translation estimation that is a linear least squares. In this case, translation depends heavily on how well the rotation is estimated, and the rotation are often poorly estimated since it omits translation information entirely. Yang [[3]](#YSC20) constructed *Translation Invariant Measurements* for the rotation estimation problem, results in better estimation but increases the measurement number complexity up to $\mathcal{O}(n^2)$. 

In this note, we focus on approaches that directly solves Problem $(1)$, that is, we directly deal with the variable $X\in\text{SE}(3)$. [Wiki](https://en.wikipedia.org/wiki/Point-set_registration) also has a comprehensive survey on point cloud registration solvers, I highly recommened one read it.

### Quadratic program 
We first rewrite the objective of Problem $(1)$ to quadratic form:

$$
\begin{aligned}
\sum_{i=1}^n\|b_i-Ra_i-t\|^2&=\sum_{i=1}^n(Ra_i+t-b_i)^\top(Ra_i+t-b_i)\\
&=\sum_{i=1}^nx^\top\underbrace{\begin{bmatrix}a_i^\top\otimes I_3&I_3&-b_i^\top\end{bmatrix}^\top \begin{bmatrix}a_i^\top\otimes I_3&I_3&-b_i^\top\end{bmatrix}}_{M_i}x\\
&=x^\top\Big(\sum_{i=1}^nM_i\Big)x\\
&=x^\top Mx
\end{aligned}
$$
where $x$ is transformed from $X$ by vectorizing $R$, concating $t$, then apply homogeneous coordinate. We say $x$ is the vectorize of $X$:

$$
\begin{pmatrix}
X_{1:3,1}&X_{1:3,2}&X_{1:3,3}&X_{1:3,4}\\
*&*&*&*\end{pmatrix}_{4\times4}\xrightarrow{\text{vectorize}}\begin{pmatrix}
X_{1:3,1}\\
X_{1:3,2}\\
X_{1:3,3}\\
X_{1:3,4}\\1\end{pmatrix}_{13\times1}
$$

> For example, 
> 
$$
\begin{pmatrix}R&t\\0^\top&1\end{pmatrix}_{4\times4}\xrightarrow{\text{vectorize}}\begin{pmatrix}
R^{(1)}\\
R^{(2)}\\
R^{(3)}\\
t\\1\end{pmatrix}_{13\times1}
$$

That is, Problem $(1)$ can be written as an equivalent (non-convex) quadratic program:

$$
\begin{aligned}
\min\ &x^\top Mx\\
\text{s.t. }&e_{13}^\top x=1\\
&x\in S=\{x\in\mathbb{R}^{13}\mid R\in\text{SO}(3)\}
\end{aligned}\tag{2}
$$

## Solving non-convex QP

### Linear relaxation
This idea is simple but actually quite practical and can be found in various literature, we just relaxation the $\text{SO}(3)$ constraints. 

$$
\begin{aligned}
\min\ &x^\top Mx\\
\text{s.t. }&e_{13}^\top x=1
\end{aligned}
$$
This is now a quadratic program with only one linear equality constraint that has a [closed-form](../../post/qp_closed_form.html) solution

$$
x^*=\frac{M^{-1}e_{13}}{e_{13}^\top M^{-1}e_{13}}.
$$

If we de-vectorize $x^*$, we get $\bar{R}\in\mathbb{R}^{3\times3}$ and $\bar{t}\in\mathbb{R}^3$, that is, $\bar{R}$ is not feasible and $t^*=\bar{t}$ is the optimal translation. We then project $\bar{R}$ to the nearest rotation matrix by singular value decomposition

$$
R^*=U\text{diag}([1,1,\det(UV^\top)])V^\top\ ;\ \ \bar{R}=U\Sigma V^\top.\tag{3}
$$
> This is also known as the orthogonal Procrustes problem [[4]](#S66).



### Semidefinite relaxation
We first write Problem $(2)$ to an equivalent non-convex quadratically constrained quadratic program (QCQP). The $\text{SO}(3)$ constraint can be written as multiple (non-convex) quadratic constraints [[5]](#BG17). The linear equality constraint in Problem $(2)$ can also be written quadratically, and now becomes a QCQP

$$
\begin{aligned}
\min_{x\in\mathbb{R}^{13}}&x^\top Mx\\
\text{s.t. }&x^\top A_ix=0,\ i=1,\dots,m\\
&x^\top E_{13}x=1
\end{aligned}
$$

Recall that we can relax [non-convex QCQP to convex SDP](../../post/qcqp_to_sdp.html), which leaves us a convex SDP

$$
\begin{aligned}
\min_{Z\in\mathbb{S}^{13}}\ &\text{tr}(MZ)\\
\text{s.t. }&\text{tr}(A_iZ)=0,\ i=1,\dots,m\\
&\text{tr}(E_{13}Z)=1\\
&X\succeq0
\end{aligned}
$$
and also a *sufficient condition* of the tightness of relaxaiton: If $\text{rank}(Z^*)=1$, then $Z^*=x^*{x^*}^\top$ and $x^*$ is the optimal solution of Problem $(2)$.

> Note that the Lagrange dual problem approach will not work here due to the fact that the matrix we are checking nullity will have rows full of zeros. This is because there is no constraint to translation, which causes us unable to find the nullspace of such matrix. Briales and Gonzalez-Jimenez [[5]](#BG17) uses the Lagrange dual approach, but they are solving the rotation estimation problem only.

### Riemannian gradient descent
The variable $X\in\text{SE}(3)$ is also a manifold, thereby we can use manifold optimization techniques [[6]](#B23), for example, Riemannian gradient descent. The idea is simple, we find a smoothing function $\bar{f}$ for the objective of Problem $(2)$ that has some gradient to project it onto the tangent space of $X$. We immediately have the smoothing function

$$
f:S\to\mathbb{R}\implies \bar{f}:\mathbb{R}^{13}\to\mathbb{R}\ ;\ \ \nabla\bar{f}(x)=2Mx.
$$

Since we are now optimizing along the $\text{SE}(3)$ manifold, the equality constraint in Problem $(2)$ is redundant. The Euclidean gradient of $\bar{f}(X)$ is just the de-vectorized $\nabla\bar{f}(x)$. We then find the Riemannian gradient by $\text{SE}(3)$'s projection

$$
\text{grad }f(X)=\text{Proj}_{X}(\nabla\bar{f}(X))=\begin{pmatrix}R_XR_{X}^\top R_{\nabla\bar{f}(X)}-R_{\nabla\bar{f}(X)}^\top R_X&t_{\nabla\bar{f}(X)}\\0^\top&1\end{pmatrix},
$$
where $X=\begin{pmatrix}R_x&t_X\\0^\top&1\end{pmatrix}$ and $\nabla\bar{f}(X)=\begin{pmatrix}R_{\nabla\bar{f}(X)}&t_{\nabla\bar{f}(X)}\\0^\top&0\end{pmatrix}$.

We use the retraction

$$
\text{R}_X(v)=\begin{pmatrix}U\text{diag}([1,1,\det(UV^\top)])V^\top&t_X+t_v\\0^\top&1\end{pmatrix},
$$
where $X=\begin{pmatrix}R_x&t_X\\0^\top&1\end{pmatrix},v=\begin{pmatrix}R_v&t_v\\0^\top&0\end{pmatrix}$ and $(R_X+R_v)=U\Sigma V^\top$.

> The upper right block is the polar retraction of $\text{SO}(3)$, which is equivalent to Equation $(3)$.

Finally, update $X$ by Riemannian gradiet descent

$$
X_{k+1}=\text{R}_{X_k}(-\alpha_k\text{grad}f(X_k)),
$$
where $\alpha_k$ is the step length.




### Lie theory
Another way to obtain Riemannian gradient is by leveraging [Lie theory](../../post/lie_theory_in_robotics.html), which is the more common way in robotics. $\text{SE}(3)$ or $\text{SO}(3)$ are not only manifolds, but also groups, which are *Lie groups*. Every Lie group has an exact equivalent *Lie algebra* (tangent space at identity), which is a vector space. Thereby, we can define derivatives on such vector space to manipulate calculus. Recall the Jacobian of norm function and the Jacobian of group actions of $\text{SE}(3)$:

$$
J^{\|g(X)\|}_{X}=\frac{\partial\|g(X)\|}{\partial X}=\frac{J_{g}(X)^\top g(X)}{\|g(X)\|}\ ;\ \ J_g(X)=\frac{\partial g(X)}{\partial X}\\[8pt]
J^{X\cdot p}_X=\frac{\partial Xp}{\partial X}=\begin{bmatrix}R&-R[p]_\times\end{bmatrix}\ ;\ \ X=\begin{pmatrix}R&t\\0^\top&1\end{pmatrix}\in\text{SE}(3)
$$

> Closed-form Jacobian for group action of $\text{SE}(3)$ can be found at Equation $(182)$ in [[7]](#SDA18).

For notation simplicity, denote the objective of Problem $(1)$

$$
f(X)=\sum_{i=1}^n\|\bar{b}_i-X\bar{a}_i\|^2 =r(X)^2\ ;\ \ r(X)=\begin{pmatrix}
\|\bar{b}_1-X\bar{a}_1\|\\
\vdots\\
\|\bar{b}_n-X\bar{a}_n\|
\end{pmatrix}\in\mathbb{R}^n.
$$

The Jacobian defined by Lie thoery is

$$
J_f=\frac{\partial f(X)}{\partial X}=2J_r(X)^\top r(X)\in\mathbb{R}^6,
$$
where

$$
J_r=\frac{\partial r(X)}{\partial X}=\begin{pmatrix}
J_{r_1}^\top\\
\vdots\\
J_{r_n}^\top
\end{pmatrix}\in\mathbb{R}^{n\times6},\\[8pt]
J_{r_i}=\frac{\partial\|\bar{b}_i-X\bar{a}_i\|}{\partial X}
=\frac{J_X^{(\bar{b}_i-X\bar{a}_i)\top}(\bar{b}_i-X\bar{a}_i)}{\|\bar{b}_i-X\bar{a}_i\|}
=\frac{\begin{bmatrix}-R&R[a_i]_\times\end{bmatrix}^\top(b_i-Ra_i-t)}{\|b_i-Ra_i-t\|}.
$$
> Note that the denominators can be cancelled out with $r(X)$.

We now have a Lie algebra $(J_f)^\wedge\in T_X{\text{SE}(3)}$, by Equation $(9)$ in [[7]](#SDA18),

$$
(J_f)^\wedge = X^{-1}\text{grad }f(X)\implies\text{grad }f(X)=X(J_f)^\wedge.
$$
> We use right-Jacobians, the gradient belongs to local tangent space.

Again, we update $X$ by Riemannian gradient descent

$$
X_{k+1}=\text{R}_{X_k}(-\alpha_k\text{grad}f(X_k)),
$$
where $\alpha_k$ is the step length.


> The gradient defined by Lie theory is identical to the gradient defined by Riemannian manifold structure. Please refer to [Riemannian and Lie thoery comparison](../../post/riemannian_lie_compare.html) for more details.

## Comparison
We give a quick performance comparison between the four methods above. Sample code can be found [here](https://github.com/doggydoggy0101/math_project/tree/main/point_cloud_registration).

<p align="center"><img src="../docs/images/post/point_cloud_registration/registration.png" width="840"/></p>


## Reference
<a id="H87">[1]</a> 
Horn, B. K. (1987). Closed-form solution of absolute orientation using unit quaternions. Josa a, 4(4), 629-642.

<a id="CTD15">[2]</a> 
Carlone, L., Tron, R., Daniilidis, K., & Dellaert, F. (2015, May). Initialization techniques for 3D SLAM: A survey on rotation estimation and its use in pose graph optimization. In 2015 IEEE international conference on robotics and automation (ICRA) (pp. 4597-4604). IEEE.

<a id="YSC20">[3]</a> 
Yang, H., Shi, J., & Carlone, L. (2020). Teaser: Fast and certifiable point cloud registration. IEEE Transactions on Robotics, 37(2), 314-333.

<a id="S66">[4]</a> 
Schönemann, P. H. (1966). A generalized solution of the orthogonal procrustes problem. Psychometrika, 31(1), 1-10.

<a id="BG17">[5]</a> 
Briales, J., & Gonzalez-Jimenez, J. (2017). Convex global 3d registration with lagrangian duality. In Proceedings of the IEEE conference on computer vision and pattern recognition (pp. 4960-4969).

<a id="B23">[6]</a> 
Boumal, N. (2023). An introduction to optimization on smooth manifolds. Cambridge University Press.

<a id="SDA18">[7]</a> 
Sola, J., Deray, J., & Atchuthan, D. (2018). A micro Lie theory for state estimation in robotics. arXiv preprint arXiv:1812.01537.
