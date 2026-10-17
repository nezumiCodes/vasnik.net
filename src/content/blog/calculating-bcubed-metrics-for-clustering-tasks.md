---
title: Calculating BCubed metrics for clustering tasks
description: How the B-Cubed algorithm scores a predicted clustering against the ground truth with element-wise precision, recall and F-score, with a worked example.
pubDate: 2024-09-05
tags:
  - clustering
  - machine-learning
  - evaluation-metrics
  - python
heroImage: ../../assets/blog/calculating-bcubed-metrics-for-clustering-tasks/hero.jpg
heroAlt: Wooden spheres spilling out of a clear tube on the left and blue cubes tumbling into a tube on the right, against a pale grey background.
heroCredit:
  author: New Material
  authorUrl: https://unsplash.com/@newmaterial
  source: Unsplash
  sourceUrl: https://unsplash.com
medium:
  url: https://medium.com/open-ai/calculating-bcubed-metrics-for-clustering-tasks-687d0b853361
  publication: Open AI
  original: true
---

## Introduction

The B-Cubed algorithm was first introduced by Bagga, A. and Baldwin B. (1998) in their paper on Entity-Based Cross-Document Coreferencing Using the Vector Space Model. The algorithm compares a predicted clustering with a ground truth (or gold standard) clustering through element-wise precision and recall scores. BCubed metrics provide a robust evaluation method for comparing predicted clusters with the ground truth, particularly in cases of overlapping or soft clusters.

For each element, the predicted and ground truth clusters containing the element are compared, and then the mean over all elements is taken. The B-Cubed algorithm can be useful in unsupervised techniques where the cluster labels are not available, because unlike macro-averaged metrics, it focuses on element-wise operations.

From the paper, two simple equations were devised calculating **precision and recall scores** for the predicted clustering:

<div class="math-block">
<math display="block" alttext="Precision equals 1 over the sum of elements, times the sum from i equals 1 to n of the count of element squared over the count of all elements in cluster"><mrow><mi>Precision</mi><mo>=</mo><mfrac><mn>1</mn><mrow><mo>∑</mo><mtext>elements</mtext></mrow></mfrac><munderover><mo>∑</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mi>n</mi></munderover><mfrac><msup><mrow><mo>(</mo><mtext>count of element</mtext><mo>)</mo></mrow><mn>2</mn></msup><mtext>count of all elements in cluster</mtext></mfrac></mrow></math>
</div>

<div class="math-block">
<math display="block" alttext="Recall equals 1 over the sum of elements, times the sum from i equals 1 to n of the count of element squared over the count of total elements from this category"><mrow><mi>Recall</mi><mo>=</mo><mfrac><mn>1</mn><mrow><mo>∑</mo><mtext>elements</mtext></mrow></mfrac><munderover><mo>∑</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mi>n</mi></munderover><mfrac><msup><mrow><mo>(</mo><mtext>count of element</mtext><mo>)</mo></mrow><mn>2</mn></msup><mtext>count of total elements from this category</mtext></mfrac></mrow></math>
</div>

<div class="math-block">
<math display="block" alttext="F-score equals 1 over k, times the sum from i equals 1 to n of 2 times Precision of C sub k times Recall of C sub k, over Precision of C sub k plus Recall of C sub k"><mrow><mi>F-score</mi><mo>=</mo><mfrac><mn>1</mn><mi>k</mi></mfrac><munderover><mo>∑</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mi>n</mi></munderover><mfrac><mrow><mn>2</mn><mo>×</mo><msub><mrow><mi>Precision</mi><mo>(</mo><mi>C</mi><mo>)</mo></mrow><mi>k</mi></msub><mo>×</mo><msub><mrow><mi>Recall</mi><mo>(</mo><mi>C</mi><mo>)</mo></mrow><mi>k</mi></msub></mrow><mrow><msub><mrow><mi>Precision</mi><mo>(</mo><mi>C</mi><mo>)</mo></mrow><mi>k</mi></msub><mo>+</mo><msub><mrow><mi>Recall</mi><mo>(</mo><mi>C</mi><mo>)</mo></mrow><mi>k</mi></msub></mrow></mfrac></mrow></math>
</div>

where _n_ above denotes the number of categories in the cluster and _k_ is the number of predicted clusters. **_Precision(C)\_k_ and _Recall(C)\_k_ are the ‘partial’ precision and recalls for each cluster.**

## Visual Example

The image below consists of four clusters as predicted from a model, where each data point is assigned a colour representing a “label” or “category”: Blue, Red and Green.

<figure class="figure-diagram">
<img src="/blog/calculating-bcubed-metrics-for-clustering-tasks/predicted-clustering.png" width="530" height="146" alt="Four predicted clusters drawn as circles. Each mixes blue, red and green points: cluster 1 has 4 blue, 2 red and 1 green; cluster 2 has 2 blue, 2 red and 3 green; cluster 3 has 1 blue and 5 red; cluster 4 has 1 blue, 2 red and 3 green." loading="lazy" decoding="async">
<figcaption>Predicted Clustering for 3 Labels (Blue, Red, Green)</figcaption>
</figure>

The correct clustering however would result in three clusters, instead of four, representing the amount of labels. This is called **ground truth clustering**. The “Blue” cluster would contain 8 data points, the “Red” would contain 11 and the “Green” would contain 7, summing up to 26 data points in total.

<figure class="figure-diagram">
<img src="/blog/calculating-bcubed-metrics-for-clustering-tasks/ground-truth-clustering.png" width="556" height="236" alt="Three ground truth clusters drawn as circles: one of blue points, one of green points and one of red points." loading="lazy" decoding="async">
<figcaption>Ground Truth Clustering for 3 Labels (Blue, Red, Green)</figcaption>
</figure>

The tables below show the element-wise precision, recall, and f-score, which are calculated based on the provided formulas and focusing on the summation part to show the element-wise operations. For precision, the denominator equals the total elements in the predicted cluster, while for recall the denominator is the total elements for that label (also equal to the ground truth cluster for that element).

<figure class="figure-table">
<table>
<caption>Table 1: Precision</caption>
<thead><tr><th scope="col">Cluster / Label</th><th scope="col">Blue</th><th scope="col">Red</th><th scope="col">Green</th></tr></thead>
<tbody>
<tr><th scope="row">Cluster 1</th><td>4<sup>2</sup>/7 = 2.286</td><td>2<sup>2</sup>/7 = 0.571</td><td>1<sup>2</sup>/7 = 0.143</td></tr>
<tr><th scope="row">Cluster 2</th><td>2<sup>2</sup>/7 = 0.571</td><td>2<sup>2</sup>/7 = 0.571</td><td>3<sup>2</sup>/7 = 1.286</td></tr>
<tr><th scope="row">Cluster 3</th><td>1<sup>2</sup>/6 = 0.167</td><td>5<sup>2</sup>/6 = 4.167</td><td>0<sup>2</sup>/6 = 0</td></tr>
<tr><th scope="row">Cluster 4</th><td>1<sup>2</sup>/6 = 0.167</td><td>2<sup>2</sup>/6 = 0.667</td><td>3<sup>2</sup>/6 = 1.500</td></tr>
</tbody>
</table>
<table>
<caption>Table 2: Recall</caption>
<thead><tr><th scope="col">Cluster / Label</th><th scope="col">Blue</th><th scope="col">Red</th><th scope="col">Green</th></tr></thead>
<tbody>
<tr><th scope="row">Cluster 1</th><td>4<sup>2</sup>/8 = 2.000</td><td>2<sup>2</sup>/11 = 0.364</td><td>1<sup>2</sup>/7 = 0.143</td></tr>
<tr><th scope="row">Cluster 2</th><td>2<sup>2</sup>/8 = 0.500</td><td>2<sup>2</sup>/11 = 0.364</td><td>3<sup>2</sup>/7 = 1.286</td></tr>
<tr><th scope="row">Cluster 3</th><td>1<sup>2</sup>/8 = 0.125</td><td>5<sup>2</sup>/11 = 2.273</td><td>0<sup>2</sup>/7 = 0</td></tr>
<tr><th scope="row">Cluster 4</th><td>1<sup>2</sup>/8 = 0.125</td><td>2<sup>2</sup>/11 = 0.364</td><td>3<sup>2</sup>/7 = 1.286</td></tr>
</tbody>
</table>
<table>
<caption>Table 3: F-score</caption>
<thead><tr><th scope="col">Cluster / Label</th><th scope="col">Blue</th><th scope="col">Red</th><th scope="col">Green</th></tr></thead>
<tbody>
<tr><th scope="row">Cluster 1</th><td>0.533</td><td>0.222</td><td>0.143</td></tr>
<tr><th scope="row">Cluster 2</th><td>0.267</td><td>0.222</td><td>0.429</td></tr>
<tr><th scope="row">Cluster 3</th><td>0.143</td><td>0.588</td><td>0</td></tr>
<tr><th scope="row">Cluster 4</th><td>0.143</td><td>0.235</td><td>0.462</td></tr>
</tbody>
</table>
<figcaption>Element-wise metrics: Precision (Table 1), Recall (Table 2), F-score (Table 3)</figcaption>
</figure>

By summing the above values in each table for each cluster separately, and following the formulas, the BCubed metrics are:

<figure class="figure-table">
<table>
<thead><tr><th scope="col"><span class="sr-only">Metric</span></th><th scope="col">Cluster 1</th><th scope="col">Cluster 2</th><th scope="col">Cluster 3</th><th scope="col">Cluster 4</th></tr></thead>
<tbody>
<tr><th scope="row">Partial Precision</th><td>4<sup>2</sup>/7 + 2<sup>2</sup>/7 + 1<sup>2</sup>/7 = 3</td><td>3<sup>2</sup>/7 + 2<sup>2</sup>/7 + 2<sup>2</sup>/7 = 2.428</td><td>1<sup>2</sup>/6 + 0 + 5<sup>2</sup>/6 = 4.333</td><td>1<sup>2</sup>/6 + 3<sup>2</sup>/6 + 2<sup>2</sup>/6 = 2.333</td></tr>
<tr><th scope="row">Partial Recall</th><td>4<sup>2</sup>/8 + 1<sup>2</sup>/7 + 2<sup>2</sup>/11 = 2.506</td><td>2<sup>2</sup>/8 + 3<sup>2</sup>/7 + 2<sup>2</sup>/11 = 2.149</td><td>1<sup>2</sup>/8 + 0 + 5<sup>2</sup>/11 = 2.398</td><td>1<sup>2</sup>/8 + 3<sup>2</sup>/7 + 2<sup>2</sup>/11 = 1.774</td></tr>
<tr><th scope="row">Partial F-score</th><td>2.73</td><td>2.279</td><td>3.088</td><td>2.015</td></tr>
</tbody>
</table>
<figcaption>Partial Precision, Recall and F-score for cluster classes calculated with the BCubed method</figcaption>
</figure>

<figure class="figure-table">
<table>
<thead><tr><th scope="col">BCubed metrics</th><th scope="col">Value</th></tr></thead>
<tbody>
<tr><th scope="row">Precision</th><td>0.465 / 46.5%</td></tr>
<tr><th scope="row">Recall</th><td>0.339 / 33.9%</td></tr>
<tr><th scope="row">F-score</th><td>0.392 / 39.2%</td></tr>
</tbody>
</table>
<figcaption>Final BCubed metrics</figcaption>
</figure>

## BCubed Python Package

The bcubed-metrics package can help calculate the metrics only by providing 2 dictionaries; the predicted clustering and ground truth clustering.

You can find the documentation [here](https://github.com/nezumiCodes/bcubed-metrics) along with a usage example. To install the package simply use pip:

```bash
pip install bcubed-metrics
```
