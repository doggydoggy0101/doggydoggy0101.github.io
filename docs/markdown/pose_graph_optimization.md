## Pose graph optimization
Pose graph optimization (PGO) is often used as the backend optimization of simultaneous localization and mapping (SLAM). During the frontend, given an initial pose $P_0$, we estimate the following poses $P_1,P_2,\dots$ given some measurements of some sensor (e.g., camera, lidar).
<p align="center"><img src="../docs/images/post/pgo/slam_frontend.png" width="300"/></p>


During the backend, we want to optimize the estimated poses. We now view the measurements as constraints, and try to find better poses that suits the constraints more. There might be addtional constraints, for example, loop closure constraints, to help optimize better poses.
<p align="center"><img src="../docs/images/post/pgo/slam_backend.png" width="375"/></p>

One strategy is to utlize probability distributions and apply Kalman filters. In this note, we focus on PGO, a non-linear leasts squares approach.

## Pose graph
Before we get into the technical details, we first look at why this particular type of non-linear least squares is called pose graph optimization. The reason is simple, we can draw a *pose graph*, which is convenient to describe the variables and constraints. For example, we could describe a backend optimization problem with $\text{SE}(2)$ poses, 2D landmarks, measurements between poses, and measurements between poses and landmarks as follows:
<p align="center"><img src="../docs/images/post/pgo/pgo.png" width="480"/></p>

Typically, when the variables are only poses, we call the problem *pose graph optimization*. On the other hand, when there are variables other than poses, we call the problem *bundle adjustment* (BA). 
> I don't think there is a precise definition of which is called what, I see people calling PGO as BA or BA as PGO.

## Non-linear least squares
Back to the least squares problem, we are minimizing a sum of square of residuals. We will discuss about the residual function the next section. Let $X=(P_1,P_2,P_3,P_4,l_1,l_2)$, the objective of the pose graph above can be written as

$$
F(X)=\|r(P_1,P_2)\|^2+\|r(P_2,P_3)\|^2+\|r(P_3,P_4)\|^2+\\[4pt]
\|r(P_1,l_1)\|^2+\|r(P_2,l_1)\|^2+\|r(P_3,l_1)\|^2+\|r(P_2,l_2)\|^2+\|r(P_3,l_2)\|^2
$$
> First line are the pose-pose constraints and the second line are the pose-landmark constraints.

Such problem can be solved by the [Gauss-Newton](../../post/gauss_newton.html) or the Levenberg–Marquardt algorithm efficiently, due to the sparsity of Jacobian. We demonstrate the Gauss-Newton method here, the objective can be rewritten as 

$$
F(X)=\|f(X)\|^2_2\ ;\ \ f(X)=\begin{pmatrix}
r(P_1,P_2)\\r(P_2,P_3)\\r(P_3,P_4)\\r(P_1,l_1)\\r(P_2,l_1)\\r(P_3,l_1)\\r(P_2,l_2)\\r(P_3,l_2)
\end{pmatrix},
$$

the Jacobian of $f(X)$ is

$$
J=\begin{pmatrix}
\frac{\partial r(P_1,P_2)}{\partial P_1}&\frac{\partial r(P_1,P_2)}{\partial P_2}&0&0&0&0\\
0&\frac{\partial r(P_2,P_3)}{\partial P_2}&\frac{\partial r(P_2,P_3)}{\partial P_3}&0&0&0\\
0&0&\frac{\partial r(P_3,P_4)}{\partial P_3}&\frac{\partial r(P_3,P_4)}{\partial P_4}&0&0\\
\frac{\partial r(P_1,l_1)}{\partial P_1}&0&0&0&\frac{\partial r(P_1,l_1)}{\partial l_1}&0\\
0&\frac{\partial r(P_2,l_1)}{\partial P_2}&0&0&\frac{\partial r(P_2,l_1)}{\partial l_1}&0\\
0&0&\frac{\partial r(P_3,l_1)}{\partial P_3}&0&\frac{\partial r(P_3,l_1)}{\partial l_1}&0\\
0&\frac{\partial r(P_2,l_2)}{\partial P_2}&0&0&0&\frac{\partial r(P_2,l_2)}{\partial l_2}\\
0&0&\frac{\partial r(P_3,l_2)}{\partial P_3}&0&0&\frac{\partial r(P_3,l_2)}{\partial l_2}
\end{pmatrix}.
$$

In Gauss-Newton, we are solving the linear equation system $H\Delta X=b$, where $H=J^\top J$ and $b=J^\top f(X)$.
<p align="center"><img src="../docs/images/post/pgo/sparsity.png" width="540"/></p>

One can observed that $H_{ii}$ is non-zero, and $H_{ij}$ is non-zero only if there is constraint between $X_i$ and $X_j$. The constraints in a pose graph in real world should be sparse and locally, therefore we

- solve $H\Delta X=b$ using sparse solvers
- perform PGO/BA locally (e.g., with 10 poses only, since the first pose and the 100 pose is not likey related)

Finally, update $X\gets X+\Delta X$. We will next look at the residual functions and its derivatives.

## Derivatives
TBD.

## pose-pose constraint

- pose $X_i=\begin{pmatrix}R_i&t_i\\0^\top&1\end{pmatrix}\in\text{SE}(2)$, vectorized as $(t_i, \theta_i)\in\mathbb{R}^3$
- pose $X_j=\begin{pmatrix}R_j&t_j\\0^\top&1\end{pmatrix}\in\text{SE}(2)$, vectorized as $(t_j, \theta_j)\in\mathbb{R}^3$
- ground truth $\hat{X}_{ij}=\begin{pmatrix}\hat{R}_{ij}&\hat{t}_{ij}\\0^\top&1\end{pmatrix}\in\text{SE}(2)$, vectorized as $(\hat{t}_{ij}, \hat{\theta}_{ij})\in\mathbb{R}^3$

### Euclidean approach

residual function, [[1]](#GKS10) Equation (30)

$$
r:\text{SE}(2)\times\text{SE}(2)\to\mathbb{R}^3\ ;\ \ f(X_i,X_j)=\begin{pmatrix}\hat{R}_{ij}^\top(R_i^\top(t_j-t_i)-\hat{t}_{ij})\\(\theta_j-\theta_i)-\hat{\theta}_{ij}\end{pmatrix}
$$

Jacobian with respective to vectorized $X_i$, [[1]](#GKS10) Equation (32)

$$
\begin{pmatrix}
\frac{\partial f}{\partial t_i}&
\frac{\partial f}{\partial \theta_i}
\end{pmatrix}=
\begin{pmatrix}
-\hat{R}_{ij}^\top R_i^\top&\hat{R}_{ij}^\top \frac{\partial R_i^\top}{\partial\theta_i}(t_j-t_i)\\
0^\top&-1
\end{pmatrix}
$$

Jacobian with respective to vectorized $X_j$, [[1]](#GKS10) Equation (33)

$$
\begin{pmatrix}
\frac{\partial f}{\partial t_j}&
\frac{\partial f}{\partial \theta_j}
\end{pmatrix}=
\begin{pmatrix}
\hat{R}_{ij}^\top R_i^\top&0\\
0^\top&1
\end{pmatrix}
$$

### Lie theory approach

residual function, [[2]](#GZL17) Equation (9.4)

$$
r:\text{SE}(2)\times\text{SE}(2)\to\mathbb{R}^3\ ;\ \ f(X_i,X_j)=X_i^{-1}X_j\ominus\hat{X}_{ij}=\text{Log}(\hat{X}_{ij}^{-1}X_i^{-1}X_j)
$$

Jacobian with respective to manifold$X_i$,

$$
\begin{aligned}
J^{\text{Log}(\hat{X}_{ij}^{-1}X_i^{-1}X_j)}_{X_i}&=J^{\text{Log}(\hat{X}_{ij}^{-1}X_i^{-1}X_j)}_{\hat{X}_{ij}^{-1}X_i^{-1}X_j}\cdot
J^{\hat{X}_{ij}^{-1}X_i^{-1}X_j}_{X_i^{-1}X_j}\cdot
J^{X_i^{-1}X_j}_{X_j^{-1}X_i}\cdot
J^{X_j^{-1}X_i}_{X_i}\cdot\\
&=-J_r^{-1}(\text{Log}(\hat{X}_{ij}^{-1}X_i^{-1}X_j))\text{Ad}_{X^{-1}_jX_i}
\end{aligned}
$$

Jacobian with respective to manifold $X_j$,

$$
\begin{aligned}
J^{\text{Log}(\hat{X}_{ij}^{-1}X_i^{-1}X_j)}_{X_j}&=J^{\text{Log}(\hat{X}_{ij}^{-1}X_i^{-1}X_j)}_{\hat{X}_{ij}^{-1}X_i^{-1}X_j}\cdot
J^{\hat{X}_{ij}^{-1}X_i^{-1}X_j}_{X_i}\\
&=J_r^{-1}(\text{Log}(\hat{X}_{ij}^{-1}X_i^{-1}X_j))
\end{aligned}
$$


> $J_r(\cdot)$ and $\text{Ad}_{(\cdot)}$ can be found at [[3]](#SDA18) Equation (163) and (159), respectively.

> <span style="color:#e15759">Error while implementing, not sure if the Lie theory approach is correct yet.</span> 


## pose-landmark constraint

TBD.


## Numerical examples
Sample code can be found [here](https://github.com/doggydoggy0101/math_project/tree/main/pose_graph_optimization).

## Reference

<a id="GKS10">[1]</a> 
Grisetti, G., Kümmerle, R., Stachniss, C., & Burgard, W. (2010). A tutorial on graph-based SLAM. IEEE Intelligent Transportation Systems Magazine, 2(4), 31-43.

<a id="GZL17">[2]</a> 
Gao, X., Zhang, T., Liu, Y., & Yan, Q. (2017). 14 lectures on visual SLAM: from theory to practice. Publishing House of Electronics Industry, 206-234.

<a id="SDA18">[3]</a> 
Sola, J., Deray, J., & Atchuthan, D. (2018). A micro Lie theory for state estimation in robotics. arXiv preprint arXiv:1812.01537.

#