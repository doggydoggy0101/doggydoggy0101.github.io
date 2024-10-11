# Uncertainty in Computer vision
This is an uncertainty interpretation for designing weights between loss functions in neural network models. In 2017, Kendall proposed one of the most well-known ideas for neural network based models in computer vision [[1]](#KG17), [[2]](#KC17), [[3]](#KGC18). We can describe model uncertainties, which results in weighting between loss functions. In this note, I will not go into the details in computer vision, but focus on how to derive the uncertainties into the weights, which I think is a general idea that can be adapted to most neural networks models, not neccesarily have to be in the field of computer vision.


## Paper notes
We give a brief (very simple) summarize of [[1]](#KG17), please refer to the original paper for more mathematical details. However, I do not think this part is very important, since they are only concepts, not things we can actually do in reality. We will discuss about the implementation details in the next section.

 There are two major types of uncertainty one can model:
- **epistemic uncertainty** model noise, can be explained away given enough data
- **aleatoric uncertainty** data noise 

### Epistemic uncertainty
We suppose the model parameters follow a Gaussian distribution $W\sim\mathcal{N}(0,I)$. Such a model is referred as a Bayesian neural network (BNN). We do not go into the details, however, the maximum likelihood is given by

$$
\mathcal{L}(\theta)=\frac{1}{N}\sum_{i=1}^N\frac{1}{2\sigma^2}\|y_i-f^{\hat{W}_i}(x_i)\|^2+\frac{1}{2}\log\sigma^2\tag{1}
$$
where $\sigma$ is the model's noise parameter (and $\hat{W}_i\sim q_\theta(W)$ is some probability distribution of the model parameters).

### Aleatoric uncertainty
We suppose the data follows a Gaussian distribution, and again, the maximum likelihood is given by

$$
\mathcal{L}_\text{NN}(\theta)=\frac{1}{N}\sum_{i=1}^N\frac{1}{2\sigma(x_i)^2}\|y_i-f(x_i)\|^2+\frac{1}{2}\log\sigma(x_i)^2\tag{2}
$$
where $\sigma(x_i)$ is the data's noise parameter.

### Combining Aleatoric uncertainty and Epistemic uncertainty
We suppose our model outputs both predictive mean as well as predictive variance:

$$
[\hat{y},\hat{\sigma}^2] = f^{\hat{W}}(x)
$$
then together, the maximum likelihood is

$$
\mathcal{L}_\text{BNN}(\theta)=\frac{1}{D}\sum_{i=1}^N\frac{1}{2\hat{\sigma}_i^2}\|y_i-\hat{y}_i\|^2+\frac{1}{2}\log\hat{\sigma}_i^2\tag{3}
$$
> $D$ is the dimension of predictive mean, could be less than $N$, e.g., drop out or weight decay.



## My understanding
If we look at Equation $(1)$, $(2)$, and $(3)$ together, they are all maximum likelihood estimation (MLE) of Gaussian distribution with different subject. The paper [[1]](#KG17) writes epistemic uncertainty and aleatoric uncertainty more complicated with additional parameters/probability models. However, in reality, the only thing we use (or tend to use) is Gaussian distribution. Thereby, I do not think epistemic uncertainty nor aleatoric uncertainty is important during implementation, Equation $(3)$ (MLE of Gaussian distribution) is the only thing we need.

In terms of neural networks, in order to use Equation $(3)$, we learn additional variance output $\hat{\sigma}$, while $\hat{y}$ is just the original model output. Assume $D=N$,

$$
\begin{aligned}
&\underbrace{y_i=f(x_i)}_\text{normal NN}\\
&\underbrace{\mathcal{L}=\frac{1}{N}\sum_{i=1}^N\|y_i-f(x_i)\|^2}_\text{normal loss}
\end{aligned}\ \ \implies
\ \ \begin{aligned}
&\underbrace{\hat{y}_i,\hat{\sigma}_i=\bar{f}(x_i)}_\text{new NN}\ ;\ \ \hat{y}_i=f(x_i)\\
&\underbrace{\bar{\mathcal{L}}=\frac{1}{N}\sum_{i=1}^N\frac{1}{2\hat{\sigma}_i^2}\|y_i-f(x_i)\|^2+\frac{1}{2}\log\hat{\sigma}_i^2}_\text{new loss}
\end{aligned}
$$

We are learning some additional variance parameter $\sigma$ from the NN model to adjust the loss function. We next look at how to derive Equation $(3)$ when everything (model and data) is assumed Gaussian distributed.

### Maximum likelihood
Assume $y\sim\mathcal{N}(\hat{y},\hat{\sigma})$, the likelihood function is

$$
\Big(\frac{1}{\sqrt{2\pi\hat{\sigma}_i^{2}}}\Big)^N \exp\Big(-\sum_{i=1}^N\frac{1}{2\hat{\sigma}_i^{2}}(y_i-\hat{y}_i)^2\Big)
$$
The log likelihood is

$$
-\frac{N}{2}\log(2\pi)-\frac{N}{2}\log(\hat{\sigma}_i^{2})-\sum_{i=1}^N \frac{1}{2\hat{\sigma}_i^2}(y_i-\hat{y}_i)^2
$$
Multiply the log likelihood by $1/N$, then maximizing the log likelihood is equivalent to minimizing

$$
\frac{1}{N}\sum_{i=1}^N \frac{1}{2\hat{\sigma}_i^2}\|y_i-\hat{y}_i\|^2+\frac{1}{2}\log(\hat{\sigma}_i^{2})
$$
We get our new loss function. Let $s_i=\log(\hat{\sigma}_i^2)$, we further write the new loss as

$$
\mathcal{L}=\frac{1}{N}\sum_{i=1}^N \frac{1}{2}\exp(-s_i)\|y_i-\hat{y}_i\|^2+\frac{1}{2}s_i\tag{4}
$$

> Equation $(4)$ is more numerically stable while training a neural network.

We can now write the relation again, 

$$
\begin{aligned}
&\underbrace{y_i=f(x_i)}_\text{normal NN}\\
&\underbrace{\mathcal{L}=\frac{1}{N}\sum_{i=1}^N\|y_i-f(x_i)\|^2}_\text{normal loss}
\end{aligned}\ \ \implies
\ \ \begin{aligned}
&\underbrace{\hat{y}_i,s_i=\bar{f}(x_i)}_\text{new NN}\ ;\ \ \hat{y}_i=f(x_i)\\
&\underbrace{\bar{\mathcal{L}}=\frac{1}{N}\sum_{i=1}^N\frac{1}{2}\exp(-s_i)\|y_i-f(x_i)\|^2+\frac{1}{2}s_i}_\text{new loss}
\end{aligned}
$$

We are now learning some additional log variance parameter $s$ from the NN model to adjust the loss function. Another interpretation is that we multiply the original loss function by some weight with an additional regularization term.


## Multi-Task using Uncertainty
Up to this point, we discussed about learning the uncertainty by $s$, which also kind of served as a regularization term. In addition, $s$ can also be served as the weight balancing between multiple loss functions. This is introduced in [[2]](#KC17), while [[3]](#KGC18) gives an example of learning camera pose. We use the example to demonstrate the idea: Suppose we are learning the rotation and translation part of camera pose by different loss functions $\mathcal{L}_R$ and $\mathcal{L}_t$. The loss function together with uncertainty is 

$$
\mathcal{L}=\mathcal{L}_R\exp(-s_R)+s_R + \mathcal{L}_t\exp(-s_t)+s_t\tag{5}
$$

> Note that a model with multiple uncertainties to learn is not exactly, but approximates Equation $(5)$, both in regression and classification case. Please refer to [[2]](#KC17) for more details.

That is, when there are multiple loss functions, learning uncertainties is also learning some weight to balance between loss functions. For example, in [[3]](#KGC18), $s_R$ is initialized as -3 for learning quaternions (rotation representation) and $s_t$ is initialized as 0 for learning translation. In other words, if you construct your loss function with weights by Equation $(5)$, you could say you are learning the model's uncertainty. Brilliant!




## Reference
<a id="KG17">[1]</a> 
Kendall, A., & Gal, Y. (2017). What uncertainties do we need in bayesian deep learning for computer vision?. Advances in neural information processing systems, 30.

<a id="KC17">[2]</a> 
Kendall, A., & Cipolla, R. (2017). Geometric loss functions for camera pose regression with deep learning. In Proceedings of the IEEE conference on computer vision and pattern recognition (pp. 5974-5983).

<a id="KGC18">[3]</a> 
Kendall, A., Gal, Y., & Cipolla, R. (2018). Multi-task learning using uncertainty to weigh losses for scene geometry and semantics. In Proceedings of the IEEE conference on computer vision and pattern recognition (pp. 7482-7491).

<a id="JGJ99">[4]</a> 
Jordan, M. I., Ghahramani, Z., Jaakkola, T. S., & Saul, L. K. (1999). An introduction to variational methods for graphical models. Machine learning, 37, 183-233.

[5] Brahmbhatt, S., Gu, J., Kim, K., Hays, J., & Kautz, J. (2018). Geometry-aware learning of maps for camera localization. In Proceedings of the IEEE conference on computer vision and pattern recognition (pp. 2616-2625).
