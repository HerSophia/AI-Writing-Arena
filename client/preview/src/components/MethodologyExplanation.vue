// src/components/MethodologyExplanation.vue
<template>
  <div class="methodology-explanation">
    <h2>评估方法说明</h2>

    <p>
      本标准旨在为大语言模型 (LLM) 在<strong>角色扮演、小说创作等创意写作领域</strong>的表现提供一个量化参考。我们希望通过收集足够多爱好者的反馈，形成一个能反映真实用户满意度的评估体系。
    </p>

    <h3>核心理念</h3>
    <ul>
      <li><strong>用户中心:</strong> 评分和评价最终应反映目标用户的实际体验和满意度。</li>
      <li><strong>领域聚焦:</strong> 专注于创意写作场景，而非通用能力评估。</li>
      <li><strong>多维评估:</strong> 从多个关键维度综合考量模型表现。</li>
      <li><strong>持续迭代:</strong> 本标准和数据将根据社区反馈和模型发展不断完善。</li>
    </ul>

    <h3>评分维度 (1-10分)</h3>
    <p>以下维度用于计算模型的综合得分（通过加权平均得出，具体权重仍在研究调整中）：</p>
    <ul>
      <li><strong>逻辑 (Logic):</strong> 故事/角色行为的内部一致性与合理性。</li>
      <li><strong>文笔 (Writing Style):</strong> 语言表达的质量、美感与感染力。</li>
      <li><strong>遵循能力 (Adherence):</strong> 理解并遵循用户指令、设定与上下文的能力。</li>
      <li><strong>发散能力 (Creativity):</strong> 在设定框架内进行创造性发挥，提供惊喜的能力。</li>
      <li><strong>语料广度 (Knowledge):</strong> 调用知识储备支撑不同背景、风格写作的能力。</li>
      <li><strong>流畅度/多样性 (Fluency):</strong> 语言自然流畅，避免不必要重复。</li>
      <li><strong>一致性/合理性 (Coherence):</strong> 内容连贯，符合情境，无怪异输出。</li>
    </ul>

    <h3>数据来源与当前状态</h3>
    <p>
      <strong>重要提示：</strong> 当前您看到的数据均为<strong>示例数据</strong>，用于展示原型功能和评估框架。其中分数分布（饼状图）是基于假设的模拟数据。
    </p>
    <p>
      我们最终的目标是建立一个<strong>社区驱动</strong>的平台：
    </p>
    <ul>
      <li>邀请广大爱好者针对具体的模型输出进行打分和评论。</li>
      <li>汇总真实的用户评分数据，计算平均分和生成分数分布。</li>
      <li>通过足够多的有效评分来体现社区对不同模型在创意写作领域表现的集体看法。</li>
    </ul>

    <h3>额外参考信息</h3>
    <p>以下维度不计入总分，仅供用户参考：</p>
    <ul>
      <li><strong>性价比 (Cost-effectiveness):</strong> 获取满意输出的成本效益。</li>
      <li><strong>多模态 (Multimodality):</strong> 处理或生成文本以外信息（如图像）的能力。</li>
    </ul>

     <h3>免责声明</h3>
     <p>本评估结果仅为基于特定维度和当前示例（未来为社区）数据的参考，不代表模型的绝对能力或适用于所有场景。请结合自身需求和体验进行判断。</p>
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
</style>