# Riemannian and Lie theory comparison
Commonly groups we occur in robotics, e.g., $\text{SO}(3)$ and $\text{SE}(3)$, are manifolds. One can manipulate derivatives by Riemannian manifold structures, however, one can also manipulate derivatives by [Lie theory](../../post/lie_theory_in_robotics.html), due to the fact that these manifolds are also groups, i.e., they are *Lie groups*. In this note, we give a simple example of constructing gradients using Riemannian manifold structure and Lie theory, respectively.


## A simple example
Consider a simple problem, the Wahba problem with only one measurement

$$
\min\ f(X)=\|b-Xa\|^2\ ;\ \ X\in\text{SO}(3),\tag{1}
$$
where

$$
X=\begin{pmatrix}r_{11}&r_{12}&r_{12}\\r_{21}&r_{22}&r_{22}\\r_{31}&r_{32}&r_{32}\end{pmatrix},\ a=\begin{pmatrix}a_1\\a_2\\a_3\end{pmatrix},\ b=\begin{pmatrix}b_1\\b_2\\b_3\end{pmatrix}.
$$

We suppose the initial guess $X=I_3$ for simplicity, that is, 

$$
X_0=\begin{pmatrix}1&0&0\\0&1&0\\0&0&1\end{pmatrix}.
$$

### Riemannian approach
We first rewrite Problem $(1)$ to an eqivalent [quadratic form](../../post/point_cloud_registration.html) by vectorizing $X$

$$
\|b-Xa\|^2\iff x^\top M x,
$$
where

$$
M=\begin{pmatrix}
a_1^2&0&0&a_1a_2&0&0&a_1a_3&0&0&-a_1b_1\\
0&a_1^2&0&0&a_1a_2&0&0&a_1a_3&0&-a_1b_2\\
0&0&a_1^2&0&0&a_1a_2&0&0&a_1a_3&-a_1b_3\\
a_1a_2&0&0&a_2^2&0&0&a_2a_3&0&0&-a_2b_1\\
0&a_1a_2&0&0&a_2^2&0&0&a_2a_3&0&-a_2b_2\\
0&0&a_1a_2&0&0&a_2^2&0&0&a_2a_3&-a_2b_3\\
a_1a_3&0&0&a_2a_3&0&0&a_3^2&0&0&-a_3b_1\\
0&a_1a_3&0&0&a_2a_3&0&0&a_3^2&0&-a_3b_2\\
0&0&a_1a_3&0&0&a_2a_3&0&0&a_3^2&-a_3b_3\\
-a_1b_1&-a_1b_2&-a_1b_3&-a_2b_1&-a_2b_2&-a_2b_3&-a_3b_1&-a_3b_2&-a_3b_3&b^\top b
\end{pmatrix},\ x=
\begin{pmatrix}r_{11}\\r_{21}\\r_{31}\\r_{12}\\r_{22}\\r_{32}\\r_{13}\\r_{23}\\r_{33}\\1\end{pmatrix}.
$$

We write the relation again

$$
f:\text{SO}(3)\to\mathbb{R}\ ;\ \ f(X)=\|b-Xa\|^2\iff f:\{x\in\mathbb{R}^{10}\mid R\in\text{SO}(3)\}\to\mathbb{R}\ ;\ \ f(x)=x^\top Mx.
$$

> We use the same function notation $f$ because they are all most the same but with differect input shape only. 

The idea of Riemannian manifold optimization is to find a smoothing function $\bar{f}$ for $f$ that has some gradient to project it onto the tangent space of $X$. We immediately have the smoothing function

$$
\bar{f}:\mathbb{R}^{10}\to\mathbb{R}\ ;\ \ \bar{f}(x)=x^\top Mx\ ;\ \ \nabla\bar{f}(x)=2Mx.
$$

Therefore, the Euclidean gradient is

$$
\nabla\bar{f}(x_0)=2Mx_0=2
\begin{pmatrix}
a_1^2-a_1b_1\\a_1a_2-a_1b_2\\a_1a_3-a_1b_3\\
a_1a_2-a_2b_1\\a_2^2-a_2b_2\\a_2a_3-a_2b_3\\
a_1a_3-a_3b_1\\a_2a_3-a_3b_2\\a_3^2-a_3b_3\\
b^\top b-a^\top b
\end{pmatrix}
$$

> We don't care the gradient of the last element.

The Euclidean gradient of the original problem is obtained by de-vectorizing $\nabla\bar{f}(x)$

$$
\nabla\bar{f}(X_0)=2
\begin{pmatrix}
a_1^2-a_1b_1&a_1a_2-a_2b_1&a_1a_3-a_3b_1\\
a_1a_2-a_1b_2&a_2^2-a_2b_2&a_2a_3-a_3b_2\\
a_1a_3-a_1b_3&a_2a_3-a_2b_3&a_3^2-a_3b_3
\end{pmatrix}
$$

Recall the projection of special orthogonal groups is

$$
\text{Proj}_X(U)=X\frac{X^\top U-U^\top X}{2}
$$

> We use the projection mulitplied by 2 to match Lie theory's gradient:

$$
\text{Proj}_X(U)=X(X^\top U-U^\top X)
$$

Thus the Riemannian gradient is

$$
\text{grad }f(X_0)=\text{Proj}_{X_0}(\nabla\bar{f}(X))=2
\begin{pmatrix}
0&a_1b_2-a_2b_1&a_1b_3-a_3b_1\\
a_2b_1-a_1b_2&0&a_2b_3-a_3b_2\\
a_3b_1-a_1b_3&a_3b_2-a_2b_3&0
\end{pmatrix}\tag{2}
$$


### Lie theory approach
We first denote additional notations for Problem $(1)$ as follows

$$
f(X)=\|b-Xa\|^2=r(X)^2\ ;\ \ r(X)=\|b-Xa\|.
$$


The gradient defined by [Lie theory](../../post/lie_theory_in_robotics.html) is

$$
\begin{aligned}
\frac{\partial f(X)}{\partial X}&=2\frac{\partial r(X)}{\partial X}r(X)\\
&=2\frac{\partial\|b-Xa\|}{\partial X}\|b-Xa\|\\
&=2\frac{(\frac{\partial b-Xa}{\partial X})^\top(b-Xa)}{\|b-Xa\|}\|b-Xa\|\\[8pt]
&=2[a]_\times^\top X^\top(b-Xa)
\end{aligned}
$$

Therefore the gradient at $X_0$ defined by Lie theory is

$$
2_3[a]_\times^\top I_3(b-I_3a)=2
\begin{pmatrix}
0&a_3&-a_2\\-a_3&0&a_1\\a_2&-a_1&0
\end{pmatrix}
\begin{pmatrix}
b_1-a_1\\b_2-a_2\\b_3-a_3
\end{pmatrix}=2
\begin{pmatrix}
a_3b_2-a_2b_3\\a_1b_3-a_3b_1\\a_2b_1-a_1b_2
\end{pmatrix}:=l
$$

Convert it back to the tangent space

$$
\text{grad }f(X_0)=I_3[l]_\times=2
\begin{pmatrix}
0&a_1b_2-a_2b_1&a_1b_3-a_3b_1\\
a_2b_1-a_1b_2&0&a_2b_3-a_3b_2\\
a_3b_1-a_1b_3&a_3b_2-a_2b_3&0
\end{pmatrix}\tag{3}
$$

We see immediately that Equation $(2)$ and Equation $(3)$ are identical, i.e., the gradient defined by Riemannian manifold structure (up to a scalar 2) and Lie theory are the same.

## Mathematical details



## Numerical examples
Sample code can be found [here](https://github.com/doggydoggy0101/math_project/tree/main/riemannian_and_lie_compare).

### Special orthogonal group (Wahba problem)
Given 2 3D point that differs by some rotation,

``` 
a: [1. 2. 3.]
b: [-0.97104865  1.97120561 -3.02843407]
```
Set initial guess $X_0=I_3$,

``` 
gradient defined by Riemannian manifold structure:
 [[  0.           7.82660583  -0.23057624]
 [ -7.82660583   0.         -23.94096999]
 [  0.23057624  23.94096999   0.        ]]

gradient defined by Lie theory:
 [[  0.           7.82660583  -0.23057624]
 [ -7.82660583   0.         -23.94096999]
 [  0.23057624  23.94096999   0.        ]]
```

The two gradients are identical in numerical experiments, even with random initial guess and multiple points. Verified Equation $(2)$ and Equation $(3)$ that 

$$
\begin{aligned}
2(a_1b_2-a_2b_1)&=(1\times1.97120561-2\times-0.97104865)=7.82660582\\
2(a_1b_3-a_3b_1)&=(1\times-3.02843407-3\times-0.97104865)=-0.23057624\\
2(a_2b_3-a_3b_2)&=(2\times-3.02843407-3\times-1.97120561)=-23.94096994
\end{aligned}
$$

### Special Euclidean group (point cloud registration)
Given 2 $n$ points of 3D point cloud, random rotation and translation, and random initial guess,

``` 
gradient defined by Riemannian manifold structure:
 [[-129.18527829   -4.8927901  -116.16634065  126.18953233]
 [  31.36032243  -97.52342836   11.83295836 -280.70397327]
 [  -0.82265493  146.21842695   23.50938512  390.58394176]
 [   0.            0.            0.            0.        ]]

gradient defined by Lie theory:
 [[-129.18527829   -4.8927901  -116.16634065  126.18953233]
 [  31.36032243  -97.52342836   11.83295836 -280.70397327]
 [  -0.82265493  146.21842695   23.50938512  390.58394176]
 [   0.            0.            0.            0.        ]]
 ``` 

the gradient defined by Riemannian manifold structure and Lie theory are also identical in this case. 


> We conclude that when we can find a smoothing function with Euclidean gradient by simply relax the feasible manifold space to Euclidean space, and also we can define the gradient by Lie theory, then the two gradients are the same.
