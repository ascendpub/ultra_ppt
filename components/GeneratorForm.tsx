
import React, { useState } from 'react';
import { Sparkles, Loader2, ArrowRight } from 'lucide-react';

interface GeneratorFormProps {
  onGenerate: (topic: string) => void;
  isGenerating: boolean;
}

const GeneratorForm: React.FC<GeneratorFormProps> = ({ onGenerate, isGenerating }) => {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onGenerate(topic);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-xl mb-4">
            <Sparkles className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">AI PPT 生成器</h1>
          <p className="text-slate-500">输入一个主题，立刻生成包含文字、图片和表格的完整演示文稿。</p>
        </div>

        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="例如：2024年人工智能发展趋势（10页）"
            disabled={isGenerating}
            className="w-full px-6 py-4 text-lg bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={!topic.trim() || isGenerating}
            className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg font-medium transition-all flex items-center gap-2 disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>生成中...</span>
              </>
            ) : (
              <>
                <span>生成</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
        
        {/* Quick Tags */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {['新产品发布会（5页）', '年度工作总结', '市场营销策略（20页）', '环保公益演讲'].map((tag) => (
            <button
              key={tag}
              onClick={() => setTopic(tag)}
              disabled={isGenerating}
              className="px-3 py-1.5 text-sm bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 hover:text-slate-900 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GeneratorForm;
