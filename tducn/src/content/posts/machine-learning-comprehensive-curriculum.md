---
title: "Comprehensive Machine Learning Curriculum: From Mathematical Foundations & Optimization to Deep Neural Networks & Verified Implementations"
description: "Exhaustive technical review of VNUK's 93-page standardized Machine Learning curriculum: ERM theory, Bayes classification, Bias-Variance decomposition, data pipeline hygiene, multi-layer perceptrons, SGD Momentum dynamics, 1D-CNN, and Rust verification."
publishDate: 2026-11-15T10:00:00+07:00
order: 1
category: "engineering"
tags: ["MachineLearning", "DeepLearning", "Mathematics", "Optimization", "NeuralNetworks", "PyTorch", "Rust"]
featured: true
recommendedFont: "academic"
lang: "en"
translationSlug: "giao-trinh-hoc-may-toan-dien"
---

> **FULL TEXT MONOGRAPH (STANDARDIZED PUBLICATION NOVEMBER 2026)**  
> Original 93-page academic monograph authored by the **VNUK AI & Machine Learning Research Group (VNUK Institute for Research and Executive Education, The University of Danang)**. The full edition integrates rigorous mathematical derivations, comparative benchmarking tables, architectural flowcharts, testable Rust verification engines, and an exhaustive 60-question analytical problem bank.  
> 
> [Download Giao_Trinh_Machine_Learning_Toan_Dien.pdf (PDF 93 Pages, 457 KB)](/downloads/Giao_Trinh_Machine_Learning_Toan_Dien.pdf)

---

## Preface & Architectural Vision

Modern machine learning in computer science curricula has moved decisively beyond treating library routines like `model.fit()` and `model.predict()` as black-box abstractions. At its core, rigorous machine learning rests upon three pillars:
1. **Statistical & Mathematical Foundations**: Candidate function spaces, Empirical Risk Minimization (ERM), underlying probability distributions, and the principle of Maximum Likelihood Estimation (MLE).
2. **Optimization Dynamics**: Geometry of high-dimensional loss surfaces, stochastic gradient descent (SGD), kinetic momentum dynamics, and adaptive momentum estimators (AdaGrad, RMSprop, Adam).
3. **Deep Architectures & Verification**: From Multi-Layer Perceptrons (MLPs) to 1D Convolutional Neural Networks (1D-CNNs) for physical sensor streams, backed by Whole-Domain Certificates that mathematically guarantee robustness against adversarial bounded perturbations.

This article systematically consolidates, derives, and analyzes the complete theoretical and experimental contents spanning **3 Parts (10 Chapters)** and **3 Experimental Appendices** of the monograph.

---

## PART I: FOUNDATIONS OF MACHINE LEARNING & OPTIMIZATION THEORY

### 1. Formal Problem Formulation: Supervised vs. Unsupervised Learning

According to modern statistical learning theory (Mitchell & Jordan, Science 2015), an arbitrary machine learning problem is rigorously modeled as a 5-tuple:

$$

\mathcal{M} = \langle T, E, \mathcal{F}, P, A \rangle

$$


Where:
* $T$ (Task): The specific prediction objective (e.g., continuous regression $y \in \mathbb{R}$, multi-class classification $y \in \{1, \dots, C\}$, or clustering).
* $E$ (Experience): The empirical observation dataset $\mathcal{D} = \{(x_i, y_i)\}_{i=1}^n$ sampled independently and identically distributed (i.i.d.) from an underlying data-generating distribution $P_{\text{data}}(x, y)$.
* $\mathcal{F}$ (Candidate Function Space): The parametric hypothesis family parameterized by $\theta \in \Theta$: $\mathcal{F}_\Theta = \{f(x; \theta) : \theta \in \Theta\}$.
* $P$ (Performance Metric): The theoretical loss functional $\mathcal{L}(f_\theta, \mathcal{D})$ or quantitative evaluation criteria ($R^2$, Balanced Accuracy, Macro-F1).
* $A$ (Optimization Algorithm): The optimization search trajectory across the function space, most commonly Stochastic Gradient Descent: $\theta^{(t+1)} = \theta^{(t)} - \eta \nabla_\theta \mathcal{L}(\theta^{(t)})$.

#### Matrix & High-Order Tensor Formalism
Learning algorithms operate over multidimensional tensor spaces:
* **Vector space**: $\langle V, \mathbb{R}, +, * \rangle$ where inputs $x \in \mathbb{R}^d$ form feature column vectors.
* **Rank-0 Tensor (Scalar)**: Real value $x \in \mathbb{R}$.
* **Rank-1 Tensor (Vector)**: Feature representation $x \in \mathbb{R}^d$ or multi-class target one-hot vector $y \in \{0, 1\}^C$.
* **Rank-2 Tensor (Matrix)**: Design matrix $X \in \mathbb{R}^{n \times d}$, where row $i$ represents observation sample $i$ and column $j$ represents feature dimension $j$.
* **Rank-3 Tensor**: Color images $[C, H, W]$ with channel depth $C=3$ (RGB), or sensor time series $[B, C, L]$ representing batch size, channel sensors, and temporal sequence length.

---

### 2. Empirical Risk Minimization (ERM) & Bias-Variance Decomposition

#### Empirical Risk vs. Generalization Risk
Let $\mathcal{L}(h(x), y)$ denote the non-negative point-wise loss. The **Theoretical Generalization Risk** $R(h)$ over the true joint distribution $P(X, Y)$ is defined by the expected functional:

$$

R(h) = \mathbb{E}_{(X, Y) \sim P}\big[\mathcal{L}(h(X), Y)\big] = \int_{\mathcal{X} \times \mathcal{Y}} \mathcal{L}(h(x), y) \, dP(x, y)

$$


Because the joint distribution $P(X, Y)$ is fundamentally unknown in empirical reality, we approximate $R(h)$ using the sample average over the training corpus $\mathcal{D} = \{(x_i, y_i)\}_{i=1}^n$, yielding the **Empirical Risk** $\hat{R}_n(h)$:

$$

\hat{R}_n(h) = \frac{1}{n} \sum_{i=1}^n \mathcal{L}(h(x_i), y_i)

$$


The generalization gap $\Delta(h) = R(h) - \hat{R}_n(h)$ quantifies overfitting. When hypothesis space $\mathcal{H}$ has excessive capacity, $\hat{R}_n(h) \to 0$ while $R(h)$ diverges sharply.

#### Analytical Derivation of the Bias-Variance Decomposition
Under the squared-error loss functional $\mathcal{L}(y, h(x)) = (h(x) - y)^2$, let $y = f(x) + \epsilon$ where $\mathbb{E}[\epsilon] = 0$ and $\text{Var}(\epsilon) = \sigma^2$. By adding and subtracting the expected conditional target $\mathbb{E}[y | x]$, the expected prediction error decomposes algebraically:

$$

\mathbb{E}_{\mathcal{D}, y}\big[(h(x; \mathcal{D}) - y)^2\big] = \underbrace{\big(\mathbb{E}_{\mathcal{D}}[h(x; \mathcal{D})] - \mathbb{E}[y | x]\big)^2}_{\text{Bias}^2(x)} + \underbrace{\mathbb{E}_{\mathcal{D}}\big[(h(x; \mathcal{D}) - \mathbb{E}_{\mathcal{D}}[h(x; \mathcal{D})])^2\big]}_{\text{Variance}(x)} + \underbrace{\text{Var}(y | x)}_{\sigma^2(x) \text{ (Noise)}}

$$


* $\text{Bias}^2$: Underfitting error due to overly restrictive inductive biases in candidate space $\mathcal{H}$.
* $\text{Variance}$: Overfitting error due to excessive sensitivity to small fluctuations in training dataset $\mathcal{D}$.
* $\sigma^2$: Irreducible error inherent to stochastic noise in data generation; serves as the absolute Bayes lower bound for all models.

---

### 3. Evaluation Metric Systems & Imbalanced Data Pitfalls

In binary classification ($y \in \{0, 1\}$), the Confusion Matrix partitions predictions into four disjoint outcomes:
* **True Positive (TP)**: Actual positive, correctly predicted positive.
* **False Positive (FP - Type I Error)**: False alarm (actual negative, falsely flagged positive).
* **False Negative (FN - Type II Error)**: Dangerous omission (actual positive, missed as negative).
* **True Negative (TN)**: Actual negative, correctly predicted negative.

$$

\text{Precision} = \frac{TP}{TP + FP}, \quad \text{Recall} = \frac{TP}{TP + FN}, \quad F_1 = \frac{2 \cdot \text{Precision} \cdot \text{Recall}}{\text{Precision} + \text{Recall}}

$$


```
                       PREDICTED
                     Positive (1)     Negative (0)
ACTUAL   Positive(1) [    TP     ]   [  FN (Miss)   ]
         Negative(0) [ FP (Alarm)]   [      TN      ]
```

> **SCIENTIFIC WARNING: THE ROC-AUC DECEPTION ON HIGHLY IMBALANCED DATA**  
> In extreme class imbalance regimes (e.g., $0.1\%$ fraud rate, negative samples $TN$ in the millions), false alarms $FP$ are drowned out by the enormous denominator $(TN + FP)$:
>
> $$
> FPR = \frac{FP}{TN + FP} \approx 0
> $$
>
> Consequently, the **ROC-AUC score is artificially inflated** ($> 0.95$). In mission-critical applications (fraud detection, medical diagnosis, malware detection), **PR-AUC (Precision-Recall AUC)** is the mandatory metric reflecting model breakdown.

---

### 4. Data Preprocessing & Pipeline Leakage Prevention

* **Missing Data Mechanisms**:
  * **MCAR (Missing Completely at Random)**: Missingness is statistically independent of observed and unobserved data.
  * **MAR (Missing at Random)**: Missingness depends on observed features, but not on missing values themselves.
  * **MNAR (Missing Not at Random)**: Missingness directly correlates with the unobserved value (e.g., high-income earners withholding salary reports).
* **Imputation Policies**: Employ **Median Imputation** for skewed continuous variables containing heavy outliers; deploy **KNN Imputation / MICE** to capture multivariate covariance.
* **The Invariant Pipeline Leakage Rule**:
  All empirical distribution parameters ($\mu_{\text{train}}, \sigma_{\text{train}}, x_{\min}, x_{\max}$) must be estimated (`fit`) strictly on the training partition. Validation and testing sets must only be transformed (`transform`) using frozen parameters.
  *Critical Violation: Calling `fit_transform()` on the full dataset prior to train/test partitioning.*

---

## PART II: PROBABILISTIC CLASSIFICATION & GENERATIVE MODELS

### 5. Bayesian Classification & The Feynman Intuitive Perspective

Following the Feynman physical intuition, classification fundamentally identifies the optimal decision hypersurface that maximizes posterior class probabilities. Bayes' Theorem formalizes this posterior:

$$

P(Y = c \mid X = x) = \frac{P(X = x \mid Y = c) \cdot P(Y = c)}{P(X = x)} = \frac{P(X = x \mid Y = c) \cdot P(Y = c)}{\sum_{k=1}^C P(X = x \mid Y = k) \cdot P(Y = k)}

$$


* **Generative Models (LDA, QDA, Naive Bayes)**: Model the joint distribution $P(X, Y) = P(X \mid Y)P(Y)$. Can synthesize artificial samples and handle arbitrary missing features.
* **Discriminative Models (Logistic Regression, SVM)**: Directly model the posterior conditional boundary $P(Y \mid X)$ or deterministic separating hyperplanes without attempting to model $P(X)$.

---

### 6. Probabilistic Generative Models: LDA, QDA, and Naive Bayes

Assuming class-conditional densities follow multivariate Gaussian distributions $\mathcal{N}(\mu_k, \Sigma_k)$:
* **LDA (Linear Discriminant Analysis)**: Constrains equal covariance matrices $\Sigma_1 = \Sigma_2 = \Sigma$. The quadratic term $x^T \Sigma^{-1} x$ cancels out algebraically in the log-likelihood ratio, producing a **flat linear decision boundary**.
* **QDA (Quadratic Discriminant Analysis)**: Allows distinct covariance matrices $\Sigma_1 \ne \Sigma_2$. The non-zero quadratic term creates **curved non-linear quadric boundaries** (ellipsoids, hyperboloids, paraboloids).

#### Naive Bayes & Laplace Smoothing
Naive Bayes introduces the conditional independence assumption: $P(x \mid y) = \prod_{j=1}^d P(x_j \mid y)$. To prevent zero-frequency collapse on unseen vocabulary, Laplace Smoothing applies an additive pseudocount $\alpha = 1$:

$$

P(x_j \mid y) = \frac{N_{y, j} + \alpha}{N_y + \alpha \cdot |V|}

$$


---

### 7. Maximum Likelihood Estimation (MLE)

Given independently distributed observations $x_1, \dots, x_n \sim p(x; \theta)$, the likelihood functional is maximized via log-likelihood:

$$

\theta_{\text{MLE}} = \arg\max_\theta \sum_{i=1}^n \ln p(x_i; \theta)

$$


For univariate Gaussian distributions $\mathcal{N}(\mu, \sigma^2)$:
* $\hat{\mu}_{\text{MLE}} = \bar{x} = \frac{1}{n} \sum x_i$ (Unbiased estimator).
* $\hat{\sigma}^2_{\text{MLE}} = \frac{1}{n} \sum (x_i - \bar{x})^2$ (Biased estimator divided by $n$; Bessel correction uses $n-1$).

#### Asymptotic Properties of MLE
As sample size $n \to \infty$:
1. **Consistency**: $\hat{\theta}_{\text{MLE}} \xrightarrow{P} \theta^*$ (Converges in probability to the ground truth parameter).
2. **Asymptotic Normality**: $\sqrt{n}(\hat{\theta}_{\text{MLE}} - \theta^*) \xrightarrow{d} \mathcal{N}(0, \mathcal{I}(\theta^*)^{-1})$, where $\mathcal{I}(\theta^*)$ is the Fisher Information Matrix.
3. **Asymptotic Efficiency**: Achieves the Cramér-Rao Lower Bound, attaining the lowest possible variance among all consistent estimators.

---

## PART III: ARTIFICIAL NEURAL NETWORKS & DEEP LEARNING

### 8. Neural Network Architectures & Numerical Stability

A standard dense fully connected layer `nn.Linear(in_features, out_features)` computes:

$$

y = x W^T + b, \quad \text{Parameters: } P = (\text{in} + 1) \times \text{out}

$$


#### Mandatory Necessity of Non-Linear Activation Functions
Without non-linear activations $\sigma(\cdot)$, stacking hundreds of deep linear layers collapses algebraically into a single trivial linear transformation:

$$

W_k \dots W_2 W_1 x = W_{\text{eff}} x

$$


#### Numerical Stability in Cross-Entropy Loss
To prevent catastrophic exponential overflow/underflow ($e^z \to \infty$ or $0$), modern frameworks compute the mathematically fused Log-Sum-Exp identity:

* **Binary Cross-Entropy**:

  $$
  \mathcal{L}(z, y) = \max(z, 0) - yz + \log(1 + e^{-|z|}) \implies \text{Use } \texttt{nn.BCEWithLogitsLoss()}

  $$

* **Multiclass Cross-Entropy (Log-Sum-Exp Trick)**:

  $$
  \log \sum_{j=1}^K e^{z_j} = m + \log \sum_{j=1}^K e^{z_j - m}, \quad \text{where } m = \max_j z_j \implies \text{Use } \texttt{nn.CrossEntropyLoss()}

  $$


---

### 9. SGD Optimization, Momentum Dynamics, and Training Physics

Vanilla Stochastic Gradient Descent (SGD) struggles with severe oscillations in narrow ill-conditioned ravines where gradient curvature is anisotropic:

$$

w_{t+1} = w_t - \eta \nabla \mathcal{L}(w_t)

$$


Polyak Momentum simulates a physical particle with mass rolling down a potential energy surface:

$$

v_{t+1} = \gamma v_t + \eta \nabla \mathcal{L}(w_t), \quad w_{t+1} = w_t - v_{t+1}

$$


When gradients oscillate in direction, historical velocity accumulates constructively along persistent directions while canceling out perpendicular high-frequency noise, dampening ravines and accelerating traversal across flat plateaus.

---

### 10. 1D Convolutional Neural Networks (1D-CNN) on Time-Series Data

For 1D multi-channel sensor signals with dimensions $[B, C_{\text{in}}, L]$ (such as 3-axis accelerometer and gyroscope streams):

$$

y[t] = (x * k)[t] = \sum_{m=-M}^M x[t - m] \cdot k[m]

$$


#### Analytical Output Length Formulation
Given input sequence length $L_{\text{in}}$, kernel filter width $K$, symmetric padding $P$, stride $S$, and dilation rate $d$:

$$

L_{\text{out}} = \left\lfloor \frac{L_{\text{in}} + 2P - d(K - 1) - 1}{S} \right\rfloor + 1

$$


#### Receptive Field Recurrence Relation
The receptive field $RF_k$ at depth layer $k$ defines the span of input temporal timesteps influencing a single feature representation:

$$

RF_k = RF_{k-1} + (K_k - 1) \prod_{i=1}^{k-1} S_i, \quad \text{where } RF_0 = 1

$$


#### Superiority of Global Average Pooling (GAP) Over Flatten
In temporal classification, replacing `Flatten` with `GlobalAveragePooling1d` dramatically reduces parameter count:
* **Flatten approach**: Vector size $64 \times 120 = 7,680$ connected to 12 classes demands **92,172 dense weights**, inducing extreme overfitting risks.
* **Global Average Pooling**: Compresses temporal dimensions into a concise $[B, 64]$ vector, reducing final classification weights down to **780 parameters** (a **$99.15\%$ parameter reduction**), fully enforcing translation invariance.

---

## EXPERIMENTAL APPENDICES

### Appendix A: 60-Question Analytical Exam Bank
* Detailed derivations of $P = (n_{\text{in}} + 1) \times n_{\text{out}}$ parameter counts across deep networks.
* Proof of asymptotic consistency for MLE under regular exponential families.
* Complete step-by-step hand calculation of numerical Momentum dynamics through turning points.

### Appendix B: Rust Automated Verification Harness
Production Rust engine verifying:
1. Complete deterministic pipeline safety, guaranteeing zero data leakage across train/validation splits.
2. Whole-domain Lipschitz stability certificate, mathematically bounding adversarial output divergence:

$$

\|\Delta z\| \le L_{\text{net}} \cdot \epsilon < \frac{\gamma(x)}{\sqrt{2}}

$$


### Appendix C: 100-Concept Cognitive Mental Model
A comprehensive topological map traversing machine learning from first principles:
`Problem Definition` $\to$ `Tensor Space` $\to$ `Pipeline Hygiene` $\to$ `Inductive Bias` $\to$ `Numerical Stability` $\to$ `Optimization Dynamics` $\to$ `Receptive Field Geometry` $\to$ `Certified Robustness`.

---

[Download Full Curriculum (PDF 93 Pages, 457 KB)](/downloads/Giao_Trinh_Machine_Learning_Toan_Dien.pdf)
