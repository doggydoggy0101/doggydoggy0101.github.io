# Gauss-Newton
The Gauss–Newton algorithm is use to solve non-linear least squares problems. One can simply use [gradient descent or Newton's method](../../post/gradient_descent_and_newton_method.html) to solve it, however, gradient descent is a first-order approximation that typically converges slower than the second-order approximation Newton's method, while Newton's method requires to compute Hessian that can be challenging to compute. The advantage of Gauss-Newton is that it is a second-order approximation algorithm without the need of computing Hessian.

We consider the unconstrained least squares with $m$ residuals $f_i:\mathbb{R}^n\to\mathbb{R}$ with $m\geq n$ and the objective $f:\mathbb{R}^n\to\mathbb{R}^m$ as follows:

$$
\min_{x\in\mathbb{R}^n}\frac{1}{2}\sum_{i=1}^mf_i(x)^2=\frac{1}{2}\|f(x)\|^2_2.\tag{1}
$$


### Gauss-Newton

For least squares, we assume that there is an increment $\Delta x$ such that $f(x+\Delta x)$ lowers the objective. Therefore, instead of solving the Problem $(1)$, we minimize the following problem:

$$
\min_{x\in\mathbb{R}^n}\frac{1}{2}\|f(x+\Delta x)\|^2_2.\tag{2}
$$

We first write the first-order Taylor approximation of $f(x+\Delta x)$,

$$
f(x+\Delta x)\approx f(x)+J(x)(x+\Delta x-x)=f(x)+J(x)\Delta x,
$$
where $J(x)$ is the $m\times n$ Jacobian matrix:

$$
J(x)=\begin{pmatrix}
\frac{\partial f_1(x)}{\partial x_1}&\cdots&\frac{\partial f_1(x)}{\partial x_n}\\
\vdots&\ddots&\vdots\\
\frac{\partial f_m(x)}{\partial x_1}&\cdots&\frac{\partial f_m(x)}{\partial x_n}
\end{pmatrix}.
$$

Next, we expand the objective of Problem $(2)$,

$$
\begin{aligned}
\frac{1}{2}\|f(x+\Delta x)\|^2_2&\approx\frac{1}{2}\|f(x)+J(x)\Delta x\|^2_2\\
&=\frac{1}{2}(f(x)+J(x)\Delta x)^\top(f(x)+J(x)\Delta x)\\
&=\frac{1}{2}(f(x)^\top f(x)+2\Delta x^\top J(x)^\top f(x) + \Delta x^\top J(x)^\top J(x)\Delta x).
\end{aligned}
$$

By setting the derivative of $\Delta x$ to zero, we get

$$
J(x)^\top f(x)+J(x)^\top J(x)\Delta x=0,\\[8pt]
\implies \Delta x=-(J(x)^\top J(x))^{-1}J(x)^\top f(x),
$$
which leaves us just a linear equation to solve. We write it as an iterative process:

$$
x_{k+1}=x_k-(J(x)^\top J(x))^{-1}J(x)^\top f(x).
$$
> The $m\geq n$ assumption is necessary because otherwise $J(x)^\top J(x)$ will not be invertible.

### Comparison with Newton's method
If we solve the problem by [Newton's method](../../post/gradient_descent_and_newton_method.html), we would use the second-order approximation of the objective of Problem $(1)$:

$$
F(x)=\frac{1}{2}\|f(x)\|^2_2\approx F(x_k)+\bar{J}(x_k)(x-x_k)+\frac{1}{2}(x-x_k)^\top \bar{H}(x)(x-x_k),
$$
where $\bar{J}(x)$ and $\bar{H}(x)$ is the Jacobian and Hessian of $F(x)$, respectively. By setting the derivative to zero, we get

$$
\bar{J}(x_k)x+\bar{H}(x_k)(x-x_k)=0,\\[8pt]
\implies x_{k+1}=-\bar{H}(x_k)^{-1}\bar{J}(x_k).
$$
Compared to Gauss-Newton, we have

$$
\bar{J}(x)=\frac{\partial}{\partial x}F(x)=\frac{\partial}{\partial x}\frac{1}{2}f(x)^\top f(x)=J(x)^\top f(x),\\[8pt]
\bar{H}(x)\approx J(x)^\top J(x).
$$
That is, we approximate the Hessian of Newton's method by the Jacobian of $f(x)$. Thereby, we say Gauss-Newton is a second-order approximation with an approximated Hessian.

#