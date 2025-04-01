<template>
  <div class="methodology-explanation">
    <h2>评估方法说明</h2>

    <p>
      本标准旨在为大语言模型 (LLM) 在<strong>角色扮演、小说创作等创意写作领域</strong>的表现提供一个量化参考。我们希望通过建立明确的评估维度和（未来）收集足够多爱好者的反馈，形成一个能反映真实用户满意度的评估体系。
    </p>

    <h3>核心理念</h3>
    <ul>
      <li><strong>用户中心:</strong> 评分和评价最终应反映目标用户的实际体验和满意度。</li>
      <li><strong>领域聚焦:</strong> 专注于创意写作场景，而非通用能力评估。</li>
      <li><strong>多维评估:</strong> 从多个关键维度综合考量模型表现，并赋予不同权重以体现相对重要性。</li>
      <li><strong>持续迭代:</strong> 本标准、权重及评估方法将根据社区反馈和模型发展不断完善。</li>
    </ul>

    <h3>评分维度与权重 (总分100)</h3>
    <p>以下维度用于计算模型的综合得分，每个维度评分范围为 1-10 分。最终总分通过各维度得分的加权平均计算得出，目前的权重分配如下：</p>
    <ul>
      <li><strong>逻辑 (Logic) - 权重: 20%</strong><br>故事/角色行为的内部一致性与设定世界观下的合理性。</li>
      <li><strong>文笔 (Writing Style) - 权重: 30%</strong><br>语言表达的质量、美感与感染力。</li>
      <li><strong>遵循能力 (Adherence) - 权重: 20%</strong><br>理解并遵循用户指令、设定与上下文的能力。</li>
      <li><strong>发散能力 (Creativity) - 权重: 10%</strong><br>在设定框架内进行创造性发挥，提供惊喜的能力。</li>
      <li><strong>语料广度 (Knowledge) - 权重: 5%</strong><br>调用知识储备支撑不同背景、风格写作的能力。</li>
      <li><strong>流畅度/多样性 (Fluency) - 权重: 10%</strong><br>语言自然流畅，避免不必要的重复（词语、句式）。</li>
      <li><strong>一致性/合理性 (Coherence) - 权重: 5%</strong><br>内容连贯，符合情境基调，无破坏氛围的怪异输出。</li>
    </ul>

    <h3>评分调整机制 (管理员)</h3>
    <p>
      为了提高评分的稳定性和一致性，减少单次主观评分的偏差，管理员在录入对某个模型某次表现的初始评分后，会启用一个迭代式的<strong>“评分退火” (Score Annealing)</strong> 机制进行调整。
    </p>
    <p>
      该机制遵循我们选定的<strong>线性插值衰减模型 (Linear Interpolation Decay)</strong>：
    </p>
    <p style="font-family: 'Courier New', Courier, monospace; background-color: #f4f4f5; padding: 5px 10px; border-radius: 4px; color: #909399;">
      <code>S<sub>n+1</sub> = S<sub>n</sub> - β * (S<sub>n</sub> - T)</code>
    </p>
    <ul>
      <li><code>S<sub>n</sub></code>: 第 n 次迭代时的分数 (初始录入的分数为 S<sub>0</sub>)。</li>
      <li><code>S<sub>n+1</sub></code>: 经过一次调整后的新分数。</li>
      <li><code>T</code>: 预设的<strong>目标分数 (Target Score)</strong>，代表我们期望该评分项趋向的合理稳定值。</li>
      <li><code>β</code>: <strong>调整因子 (Adjustment Factor / Step Size)</strong>，介于 0 和 1 之间，控制每次迭代向目标分数靠近的幅度（即收敛速度）。</li>
    </ul>
    <p>
      管理员可以（根据预设或手动）应用此公式若干次，使得分数逐步、可控地从初始主观判断值向更中允、更符合标准区间的 `T` 值靠近。这个过程有助于平滑掉异常高分或低分，使最终录入数据库的分数更具参考价值。管理员可以配置目标分数 `T` 和调整因子 `β` 以适应不同场景。
    </p>

    <h3>数据来源与当前状态</h3>
    <p>
      <strong>重要提示：</strong> 当前您看到的数据均为<strong>示例数据</strong>，用于展示原型功能和评估框架。其中分数分布（饼状图）是基于假设的模拟数据。
    </p>
    <p>
      我们最终的目标是建立一个<strong>社区驱动</strong>的平台：
    </p>
    <ul>
      <li>邀请广大爱好者针对具体的模型输出进行打分和评论。</li>
      <li>汇总真实的用户评分数据，（可能结合管理员的调整）计算平均分和生成分数分布。</li>
      <li>通过足够多的有效评分来体现社区对不同模型在创意写作领域表现的集体看法。</li>
    </ul>

    <h3>额外参考信息</h3>
    <p>以下维度不计入总分，仅供用户参考：</p>
    <ul>
      <li><strong>性价比 (Cost-effectiveness):</strong> 获取满意输出的成本效益。</li>
      <li><strong>多模态 (Multimodality):</strong> 处理或生成文本以外信息（如图像）的能力。</li>
    </ul>

     <h3>免责声明</h3>
     <p>本评估结果仅为基于特定维度、权重、调整机制和当前示例（未来为社区）数据的参考，不代表模型的绝对能力或适用于所有场景。请结合自身需求和体验进行判断。</p>
  </div>
</template>

<script setup lang="ts">
// 当前组件仅为静态展示，无需脚本逻辑
</script>

<style scoped>
.methodology-explanation {
  line-height: 1.7;
  font-size: 14px;
  color: #606266; /* Element Plus Regular Text */
}

.methodology-explanation h2,
.methodology-explanation h3 {
  color: #303133; /* Element Plus Primary Text */
  margin-top: 20px;
  margin-bottom: 10px;
  font-weight: 600;
}

.methodology-explanation h2 {
  text-align: center;
  margin-top: 0;
  font-size: 1.5em;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
}

.methodology-explanation h3 {
  font-size: 1.2em;
  border-left: 4px solid #409EFF; /* Element Plus Primary Color */
  padding-left: 8px;
}

.methodology-explanation ul {
  padding-left: 25px;
  list-style-type: disc; /* 使用实心圆点 */
}

.methodology-explanation li {
  margin-bottom: 8px;
}

/* 给评分维度的列表项增加一点下间距，并让权重突出 */
.methodology-explanation h3 + p + ul > li {
    margin-bottom: 12px;
}
.methodology-explanation h3 + p + ul > li strong {
    /* color: #409EFF;  Optional: highlight weight color */
}


.methodology-explanation strong {
  color: #303133;
  font-weight: 600;
}

.methodology-explanation p i {
    color: #909399; /* Element Plus Secondary Text */
}

.methodology-explanation strong + span { /* 示例数据提示加重 */
    color: #E6A23C; /* Element Plus Warning Color */
    font-weight: bold;
}

/* 为公式添加下标样式 */
.methodology-explanation code sub {
    font-size: 0.8em;
    vertical-align: sub;
}
</style>