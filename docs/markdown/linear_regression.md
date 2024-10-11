# Linear regression

Linear regression is a supervised learning model that assumes the *hypothesis* linear. For example, suppose that we have a set of training example $\{(x^{(i)},y^{(i)})\}_{i=1}^n=\{(20, 5), (55, 12), (30, 10)\}$ where $x$ is the data/feature and $y$ is the label/target. Note the hypothesis here is $h:\mathbb{R}\to\mathbb{R}$ where

$$
h(x)=\theta_0+\theta_1x.\tag{1}
$$

Here $\theta_i$ are the parameters/weights, and if we let $x_0=1$ (intercept term), Equation $(1)$ can be written more generally for higher dimension data $x\in\mathbb{R}^d$

$$
h_\theta(x)=\sum_{j=1}^d\theta_jx_j=\theta^\top x.
$$

For the simplest linear regression model, we use the residual function

$$
r_i(\theta)=h_\theta(x^{(i)})-y^{(i)},\tag{2}
$$
and set the least squares error function as sum of squared residuals

$$
e(\theta)=\frac{1}{2}\sum_{i=1}^nr_i(\theta)^2=\frac{1}{2}\sum_{i=1}^n(h_\theta(x^{(i)})-y^{(i)})^2.\tag{3}
$$

### Probabilistic interpretation
Before we go further, lets first look at why the least squares cost function $e$ is reasonable. We assume that the relationship between data and label as follows:

$$
y^{(i)}=\theta^\top x^{(i)}+\varepsilon^{(i)},
$$
where $\varepsilon\sim\mathcal{N}(0,\sigma^2)$ is an normal distributed error term. The idea is to derive least squares from statistic perspective. The probability density function of $y$ given $x$ parameterized by $\theta$ is

$$
p(y^{(i)}\mid x^{(i)};\theta)=\frac{1}{\sqrt{2\pi\sigma^2}}\exp\bigg(-\frac{(y^{(i)}-\theta^\top x^{(i)})^2}{2\sigma^2}\bigg),
$$
> Note that we do not write $p(y^{(i)}\mid x^{(i)},\theta)$ since $\theta$ is not a random variable.

and the likelihood function is

$$
\begin{aligned}
L(\theta)&=\prod_{i=1}^n\frac{1}{\sqrt{2\pi\sigma^2}}\exp\bigg(-\frac{(y^{(i)}-\theta^\top x^{(i)})^2}{2\sigma^2}\bigg)\\
&=\bigg(\frac{1}{\sqrt{2\pi\sigma^2}}\bigg)^n\exp\bigg(-\frac{1}{2\sigma^2}\sum_{i=1}^n(y^{(i)}-\theta^\top x^{(i)})^2\bigg)
\end{aligned}
$$

The log likelihood funcion is 

$$
\begin{aligned}
\ln L(\theta)&=n\ln\bigg(\frac{1}{\sqrt{2\pi\sigma^2}}\bigg)-\frac{1}{2\sigma^2}\sum_{i=1}^n(y^{(i)}-\theta^\top x^{(i)})^2\\
&=-\frac{n}{2}\ln(2\pi\sigma^2)-\frac{1}{2\sigma^2}\sum_{i=1}^n(y^{(i)}-\theta^\top x^{(i)})^2
\end{aligned}
$$
and thus

$$
\max_\theta -\frac{1}{2\sigma^2}\sum_{i=1}^n(y^{(i)}-\theta^\top x^{(i)})^2\iff\min_\theta \frac{1}{2}\sum_{i=1}^n(y^{(i)}-\theta^\top x^{(i)})^2
$$
> We can conclude that the MLE of normal distribution is equivalent to a least squares. 

### Least squares closed-form

Now lets look at how to actually solve Problem $(3)$. We can write the residual functions in matrix form

$$
\underbrace{\begin{pmatrix}-(x^{(1)})^\top-\\\vdots\\-(x^{(n)})^\top-\end{pmatrix}}_X\theta-\underbrace{\begin{pmatrix}y^{(1)}\\\vdots\\y^{(n)}\end{pmatrix}}_Y=\begin{pmatrix}r_1(\theta)\\\vdots\\r_n(\theta)\end{pmatrix}
$$

thereby Problem $(3)$ can be rewritten as follows:

$$
\frac{1}{2}\sum_{i=1}^n(h_\theta(x^{(i)})-y^{(i)})^2=\frac{1}{2}(X\theta-Y)^\top(X\theta-Y).\tag{4}
$$

To solve Problem $(4)$, we set the derivative to zero

$$
\frac{\partial}{\partial\theta}\bigg(\frac{1}{2}(X\theta-Y)^\top(X\theta-Y)\bigg)=\frac{1}{2}\frac{\partial}{\partial\theta}(\theta^\top X^\top X\theta-2Y^\top X\theta+Y^\top Y)=\frac{1}{2}(2X^\top X\theta-X^\top Y)=0
$$
and thus we get the closed-form solution:

$$
\theta=(X^\top X)^{-1}X^\top Y.\tag{5}
$$

### Gradient approach
We further discuss about using gradient methods to solve Problem $(3)$. Note that if the model is linear, then one can simply use the closed-form $(5)$. We discuss about the gradient approach due to the fact that classification models can also derive a similar gradient descent, and both are the core idea of neural networks.

We write a component-wise [gradient descent](../../post/gradient_descent_and_newton_method.html) for a single data

$$
\begin{aligned}
\theta_j\gets\theta_j-\alpha\frac{\partial}{\partial\theta_j}e(\theta)
&=\theta_j-\alpha\frac{\partial}{\partial\theta_j}\bigg(\frac{1}{2}(h_\theta(x^{(i)})-y^{(i)})^2\bigg)\\
&=\theta_j-\alpha(h_\theta(x^{(i)})-y^{(i)})\frac{\partial}{\partial\theta_j}\bigg(\sum_{j=1}^d\theta_jx^{(i)}_j-y\bigg)\\
&=\theta_j-\alpha(h_\theta(x^{(i)})-y^{(i)})x^{(i)}_j
\end{aligned}
$$

Rewrite it into vector form

$$
\theta\gets\theta-\alpha(h_\theta(x^{(i)})-y^{(i)})x^{(i)}\tag{6}
$$


For more than one data, 

$$
\theta\gets\theta-\alpha\sum_{i=1}^n(h_\theta(x^{(i)})-y^{(i)})x^{(i)}
$$

This method looks at every example in the entire training set on every step, and is called *batch gradient descent*. Another approach is to update $\theta$ each time we encounter a data

$$
\theta\gets\theta-\alpha(h_\theta(x^{(i)})-y^{(i)})x^{(i)},\ i=1,\dots,n
$$

This is called *stochastic gradient descent*, whereas batch gradient descent has to scan through the entire training set before taking a single update, while stochastic gradient descent can start making progress right away. When the $n$ is large, stochastic gradient descent is often preferred over batch gradient descent.
