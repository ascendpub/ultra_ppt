
import React, { useState } from 'react';
import { generatePresentationContent, performDeepResearch } from './services/geminiService';
import { createPPTX } from './services/pptService';
import { PresentationData } from './types';
import GeneratorForm from './components/GeneratorForm';
import SlidePreview from './components/SlidePreview';
import { Download, LayoutTemplate, AlertCircle, Search, PenTool, CheckCircle2 } from 'lucide-react';

type GenerationStep = 'idle' | 'researching' | 'designing' | 'completed' | 'error';

const App: React.FC = () => {
  const [status, setStatus] = useState<GenerationStep>('idle');
  const [data, setData] = useState<PresentationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [researchSummary, setResearchSummary] = useState<string>("");

  const handleGenerate = async (topic: string) => {
    setStatus('researching');
    setError(null);
    setData(null);
    setResearchSummary("");

    try {
      // Phase 1: Deep Research
      console.log("Phase 1: Researching...");
      const research = await performDeepResearch(topic);
      setResearchSummary(research);
      
      // Phase 2: Generation
      setStatus('designing');
      console.log("Phase 2: Designing...");
      const generatedData = await generatePresentationContent(topic, research);
      
      setData(generatedData);
      setStatus('completed');
    } catch (err: any) {
      console.error("Workflow error:", err);
      setStatus('error');
      setError("生成失败，请检查网络或稍后重试。错误信息: " + (err.message || 'Unknown error'));
    }
  };

  const handleDownload = () => {
    if (data) {
      createPPTX(data);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutTemplate className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-xl text-slate-900 tracking-tight">AutoPPT</span>
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">Pro</span>
          </div>
          {data && (
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              下载 PPT (.pptx)
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Input Section */}
        {status === 'idle' && (
           <div className="mt-12 mb-20 animate-in fade-in zoom-in duration-500">
             <GeneratorForm onGenerate={handleGenerate} isGenerating={false} />
           </div>
        )}

        {/* Loading / Processing State */}
        {(status === 'researching' || status === 'designing') && (
          <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-700">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100 relative overflow-hidden">
               {/* Progress Bar */}
               <div className="absolute top-0 left-0 h-1 bg-blue-100 w-full">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-1000 ease-in-out" 
                    style={{ width: status === 'researching' ? '40%' : '85%' }}
                  ></div>
               </div>

               <div className="space-y-8">
                  {/* Step 1: Research */}
                  <div className={`flex items-start gap-4 transition-opacity duration-500 ${status === 'researching' ? 'opacity-100' : 'opacity-50'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${status === 'researching' ? 'bg-blue-100 text-blue-600 animate-pulse' : 'bg-green-100 text-green-600'}`}>
                       {status === 'designing' ? <CheckCircle2 className="w-6 h-6" /> : <Search className="w-5 h-5" />}
                    </div>
                    <div>
                       <h3 className="font-semibold text-slate-900">深度研究 (Deep Research)</h3>
                       <p className="text-sm text-slate-500 mt-1">
                         {status === 'researching' ? '正在全网搜索最新数据、趋势和事实...' : '已完成数据采集与分析'}
                       </p>
                    </div>
                  </div>

                  {/* Step 2: Design */}
                  <div className={`flex items-start gap-4 transition-opacity duration-500 ${status === 'designing' ? 'opacity-100' : 'opacity-40'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${status === 'designing' ? 'bg-blue-100 text-blue-600 animate-pulse' : 'bg-slate-100 text-slate-400'}`}>
                       <PenTool className="w-5 h-5" />
                    </div>
                    <div>
                       <h3 className="font-semibold text-slate-900">结构设计 (Architecture)</h3>
                       <p className="text-sm text-slate-500 mt-1">
                         {status === 'designing' ? '正在基于真实数据构建大纲、生成图表和排版...' : '等待研究数据...'}
                       </p>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {status === 'error' && error && (
          <div className="max-w-xl mx-auto mt-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-in fade-in">
             <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
             <div>
               <h3 className="text-red-800 font-medium">出错了</h3>
               <p className="text-red-600 text-sm mt-1">{error}</p>
               <button 
                 onClick={() => setStatus('idle')} 
                 className="mt-3 text-sm text-red-700 font-medium hover:text-red-900 underline"
               >
                 返回重试
               </button>
             </div>
          </div>
        )}

        {/* Results Preview */}
        {status === 'completed' && data && (
          <div className="animate-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-end justify-between mb-8">
              <div>
                <button 
                  onClick={() => setStatus('idle')} 
                  className="text-sm text-slate-500 hover:text-slate-800 mb-2 hover:underline"
                >
                  ← 生成新主题
                </button>
                <h2 className="text-3xl font-bold text-slate-900">{data.topic}</h2>
                <div className="flex items-center gap-4 mt-2">
                   <p className="text-slate-500">共 {data.slides.length} 页演示文稿</p>
                   <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                   <p className="text-green-600 text-sm font-medium flex items-center gap-1">
                     <CheckCircle2 className="w-3 h-3" /> 基于全网实时搜索数据
                   </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.slides.map((slide, index) => (
                <SlidePreview 
                  key={index} 
                  slide={slide} 
                  index={index} 
                  themeColor={data.themeColor || '#3B82F6'} 
                />
              ))}
            </div>
            
            <div className="mt-12 flex justify-center pb-8">
              <button
                onClick={handleDownload}
                className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all shadow-lg hover:shadow-blue-500/25 hover:-translate-y-1"
              >
                <Download className="w-6 h-6" />
                下载完整 PPT
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
