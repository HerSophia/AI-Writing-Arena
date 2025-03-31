export interface Dimension { id: number; name: string; description: string; assessment_points: string[]; scoring_reference: string; category: 'Scoring' | 'Additional Info'; suggested_weight_range: string; display_order?: number; }
export interface LlmBasicInfo { id: number; name: string; version: string; provider: string; description: string; }
export interface ScoreDetail { score: number;}
export interface ScoreDistribution { range: string; count: number; }
export interface EvaluationData { llm_id: number; scores: { [dimensionId: string]: ScoreDetail; }; score_distributions?: { [dimensionId: string]: ScoreDistribution[]; }; additional_info_comments?: { [dimensionId: string]: { comment: string }; }; totalScore: number | null; }
export interface LlmCombinedEvaluation { llm: LlmBasicInfo; scores: EvaluationData['scores']; score_distributions?: EvaluationData['score_distributions']; additional_info_comments?: EvaluationData['additional_info_comments']; }
export interface FilterSettings { providers: string[]; [key: string]: any; /* 其他筛选条件 */ }
export interface SortSettings { field: string; order: 'ascending' | 'descending'; }
export type ScoreDescriptions = {
  [dimensionId: string]: {
    [score: string]: string; // score 是 1-10 的字符串
  }
}