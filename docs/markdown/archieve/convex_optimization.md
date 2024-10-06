---
author: Ian Chen
title: Convex optimization problems
date: 2024-07-12
description: Convex optimization chapter 4
math: true
toc: false
tags:
  - convex
  - optimization

draft: true
---

This is a note about Convex optimization problems -- chapther 4 of Convex optimization by Boyd. Section labels and Equation labels follow the textbook [[1]](#BV04).

# 4.1 Optimization problems
### 4.1.1 Basic terminology
We use the notation
$$
\begin{aligned}
\min_{x\in\mathbb{R}^n}\ &f_0(x)\\\\
\text{s.t. }\ &f_i(x)\leq0,\ i=1,\dots,m\\\\
&h_i(x)=0,\ i=1,\dots,p
\end{aligned}\tag{4.1}
$$
to describe the problem of finding an \\(x\\) that minimized \\(f_0(x)\\) with some constraints. We call
- \\(x\in\mathbb{R}\\) the *optimization variable*
- \\(f_0:\mathbb{R}^n\to\mathbb{R}\\) the *objective function*
- \\(f_i:\mathbb{R}^n\to\mathbb{R}\\) the *equality constraints*
- \\(h_i:\mathbb{R}^n\to\mathbb{R}\\) the *ineuality constraints*
> We say the problem is *unconstrained* if there is no constraints in Problem \\((4.1)\\).

The *domain* of Problem \\((4.1)\\) is defined as
$$
\mathcal{D}=\bigcap_{i=0}^m\mathbf{dom}\ f_i\cap\bigcap_{i=1}^p\mathbf{dom}\ h_i.
$$

A point \\(x\in\mathcal{D}\\) is *feasible* if it satisfies all constraints. Problem \\((4.1)\\) is said to be feasible if there exists at least one feasible point. The set of feasible points is called the *feasible set*. The *optimal value* \\(p^*\\) of Problem \\((4.1)\\) is defined as
$$
p^\*=\inf\\{f_0(x)\mid f_i(x)\leq0,i=1,\dots,m,\ h_i(x)=0,i=1,\dots,p\\}.
$$

We say \\(x^*\\) is an *optimal point* if \\(f_0(x^\*)=p^\*\\). The set of all optimal points is called the *optimal set*, denoted as 
$$
X_\text{opt}=\\{x\mid f_i(x)\leq0,\ i=1,\dots,m,\ h_i(x)=0,i=1,\dots,p,\ f_0(x)=p^\*\\}.
$$

A feasible point \\(x\\) with \\(f_0(x)\leq p^\*+\epsilon\\) is called *\\(\epsilon\\)-suboptimal*. A feasible point \\(x\\) is *locally optimal* if there exists an \\(R>0\\) such that \\(x\\) solves
$$
\begin{aligned}
\min_{x\in\mathbb{R}^n}\ &f_0(z)\\\\
\text{s.t. }\  &f_i(z)\leq0,\ i=1,\dots,m\\\\
&h_i(z)=0,\ i=1,\dots,p\\\\
&\\|z-x\\|_2\leq R
\end{aligned}
$$
with variable \\(z\\), i.e., \\(x\\) miminizes \\(f_0\\) over a neighborhood.
> Normally, optimal means *global optimal*.

We say the \\(i\\)-th constraint \\(f_i(x)\leq0\\) is
- *active/binding* if \\(f_i(x)=0\\) (at the boundary of feasible set)
- *inactive/non-binding* if \\(f_i(x)<0\\) (interior of the feasible set)
- *redundant* if it does not affect the feasible set
> When proving most optimal conditions, only binding constraints are required to be differentiable, while non-binding ones are only required to be continuous. This textbook assumes all constraints are differentiable in Sec 5.5.3.


To be complete...


## Reference
<a id="BV04">[1]</a> 
S. Boyd, L. Vandenberghe, Convex optimization, Cambridge university press, 2004.

[2] Bazaraa, M. S., Sherali, H. D., & Shetty, C. M. (2006). Nonlinear programming: theory and algorithms. John wiley & sons.