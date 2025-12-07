
import React from 'react';
import { SlideData, SlideType } from '../types';
import { PieChart, BarChart, Activity, Quote, ArrowRight, PlayCircle } from 'lucide-react';

interface SlidePreviewProps {
  slide: SlideData;
  index: number;
  themeColor: string;
}

const SlidePreview: React.FC<SlidePreviewProps> = ({ slide, index, themeColor }) => {
  const slideStyle = {
    aspectRatio: '16/9',
  };

  const renderContent = () => {
    switch (slide.type) {
      case SlideType.TITLE:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-white relative overflow-hidden">
             {/* Left sidebar decoration */}
             <div className="absolute top-0 left-0 w-1/3 h-full" style={{ backgroundColor: themeColor }}></div>
             
             <div className="relative z-10 w-full pl-[33%] text-left">
                <h2 className="text-3xl font-bold mb-4 text-slate-900 leading-tight">{slide.title}</h2>
                {slide.subtitle && <p className="text-lg text-slate-500">{slide.subtitle}</p>}
             </div>
          </div>
        );

      case SlideType.CLOSING:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 text-white relative overflow-hidden" style={{ backgroundColor: themeColor }}>
            <div className="absolute inset-0 bg-black/10"></div>
            <h2 className="text-4xl font-bold mb-4 relative z-10">{slide.title}</h2>
            {slide.subtitle && <p className="text-xl text-white/80 relative z-10">{slide.subtitle}</p>}
            {slide.sourceUrl && (
                <div className="mt-8 relative z-10 px-4 py-2 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm cursor-pointer hover:bg-white/30 transition-colors">
                    了解更多: {slide.sourceUrl}
                </div>
            )}
          </div>
        );

      case SlideType.CONTENT_TEXT_IMAGE:
        return (
          <div className="h-full p-8 bg-white flex flex-col">
            <h3 className="text-2xl font-bold mb-2" style={{ color: themeColor }}>{slide.title}</h3>
            <div className="w-full h-0.5 bg-slate-200 mb-6"></div>
            
            <div className="flex gap-6 h-full">
                <div className="flex-1">
                <ul className="space-y-3">
                    {slide.bullets?.map((b, i) => (
                    <li key={i} className="flex items-start text-sm text-slate-700">
                        <span className="mr-2 mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: themeColor }}></span>
                        {b}
                    </li>
                    ))}
                </ul>
                </div>
                <div className="flex-1 flex items-start justify-center">
                {slide.imageKeyword && (
                    <div className="w-full h-40 rounded-lg overflow-hidden shadow-xl bg-slate-100 relative group">
                    <img 
                        src={`https://picsum.photos/seed/${slide.imageKeyword}${index}/400/300`} 
                        alt={slide.imageKeyword} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    </div>
                )}
                </div>
            </div>
          </div>
        );

      case SlideType.CONTENT_VIDEO:
        return (
          <div className="h-full p-8 bg-white flex flex-col">
            <h3 className="text-2xl font-bold mb-2" style={{ color: themeColor }}>{slide.title}</h3>
            <div className="w-full h-0.5 bg-slate-200 mb-6"></div>
            
            <div className="flex-1 flex items-center justify-center">
                <div className="w-3/4 h-48 bg-slate-900 rounded-xl shadow-2xl flex items-center justify-center relative group overflow-hidden">
                     {slide.imageKeyword ? (
                        <img 
                            src={`https://picsum.photos/seed/${slide.imageKeyword}/600/400`} 
                            className="absolute inset-0 w-full h-full object-cover opacity-60"
                        />
                     ) : null}
                     <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center z-10 transition-transform group-hover:scale-110">
                        <PlayCircle className="w-10 h-10 text-white" />
                     </div>
                     <div className="absolute bottom-4 left-4 text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">
                        Video Placeholder
                     </div>
                </div>
            </div>
          </div>
        );
        
      case SlideType.TABLE:
        return (
          <div className="h-full p-8 bg-white flex flex-col">
             <h3 className="text-2xl font-bold mb-6" style={{ color: themeColor }}>{slide.title}</h3>
             <div className="flex-1 overflow-auto">
               <table className="w-full text-sm text-left border-collapse">
                 <thead>
                   <tr>
                     {slide.tableHeaders?.map((h, i) => (
                       <th key={i} className="p-2 text-xs font-bold text-white uppercase" style={{ backgroundColor: themeColor }}>{h}</th>
                     ))}
                   </tr>
                 </thead>
                 <tbody>
                   {slide.tableRows?.map((row, i) => (
                     <tr key={i} className="border-b border-slate-100 even:bg-slate-50">
                       {row.map((cell, j) => (
                         <td key={j} className="p-2 text-xs text-slate-600">{cell}</td>
                       ))}
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        );

      case SlideType.BIG_NUMBER:
        return (
           <div className="h-full p-8 bg-white flex flex-col items-center justify-center relative overflow-hidden">
              <h3 className="absolute top-8 left-8 text-2xl font-bold" style={{ color: themeColor }}>{slide.title}</h3>
              
              <div className="relative flex flex-col items-center justify-center p-12 rounded-full border-4" style={{ borderColor: themeColor }}>
                 <div className="text-6xl font-black tracking-tighter" style={{ color: themeColor }}>
                    {slide.bigNumber}
                 </div>
              </div>
              
              <div className="mt-6 text-xl font-medium text-slate-500 uppercase tracking-wide">
                {slide.bigNumberLabel}
              </div>
           </div>
        );

      case SlideType.QUOTE:
        return (
          <div className="h-full p-8 flex flex-col items-center justify-center relative">
             {/* Background with transparency simulation */}
             <div className="absolute inset-0 opacity-10" style={{ backgroundColor: themeColor }}></div>
             
             <Quote className="w-16 h-16 mb-4 opacity-30" style={{ color: themeColor }} />
             <blockquote className="text-xl font-serif italic text-slate-800 text-center max-w-lg mb-6 leading-relaxed">
               "{slide.quoteText}"
             </blockquote>
             {slide.quoteAuthor && (
               <cite className="text-slate-600 font-bold not-italic">— {slide.quoteAuthor}</cite>
             )}
          </div>
        );

      case SlideType.CHART:
        return (
          <div className="h-full p-8 bg-white flex flex-col">
             <h3 className="text-2xl font-bold mb-4" style={{ color: themeColor }}>{slide.title}</h3>
             <div className="flex-1 flex items-center justify-center bg-slate-50 rounded-lg border border-slate-100 relative p-4">
                {/* Simulated Chart Visuals */}
                <div className="w-full h-full flex flex-col items-center justify-center opacity-80">
                     {slide.chart?.type === 'PIE' && (
                         <div className="relative w-32 h-32 rounded-full border-[16px]" style={{ borderColor: themeColor }}></div>
                     )}
                     {slide.chart?.type === 'BAR' && (
                         <div className="flex items-end gap-2 h-32 w-full px-8">
                             {[40, 70, 50, 90, 60].map((h, i) => (
                                 <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, backgroundColor: themeColor, opacity: 0.5 + (i * 0.1) }}></div>
                             ))}
                         </div>
                     )}
                     {slide.chart?.type === 'LINE' && (
                         <div className="w-full h-32 border-l-2 border-b-2 border-slate-300 relative">
                             <svg className="absolute inset-0 w-full h-full p-2" preserveAspectRatio="none">
                                <polyline points="0,80 40,50 80,60 120,20 160,40" fill="none" stroke={themeColor} strokeWidth="3" />
                             </svg>
                         </div>
                     )}
                     <div className="mt-4 text-center">
                        <p className="text-xs font-bold text-slate-500 uppercase">{slide.chart?.dataLabel}</p>
                        <div className="flex gap-2 justify-center mt-1">
                            {slide.chart?.labels.slice(0, 3).map((l, i) => (
                                <span key={i} className="text-[10px] text-slate-400">{l}</span>
                            ))}
                        </div>
                     </div>
                </div>
             </div>
          </div>
        );

      case SlideType.TIMELINE:
        return (
          <div className="h-full p-8 bg-white flex flex-col">
            <h3 className="text-2xl font-bold mb-8" style={{ color: themeColor }}>{slide.title}</h3>
            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-full flex justify-between items-center px-4">
                {/* Dotted Line */}
                <div className="absolute top-1/2 left-4 right-4 border-t-2 border-dashed border-slate-300 -translate-y-1/2"></div>
                
                {slide.timeline?.map((event, i) => (
                  <div key={i} className="relative flex flex-col items-center group z-10 w-1/4">
                    <div className="mb-3 text-sm font-bold" style={{ color: themeColor }}>{event.year}</div>
                    <div className="w-4 h-4 rounded-full bg-white border-4 box-content mb-2" style={{ borderColor: themeColor }}></div>
                    <div className="text-center w-full px-1">
                      <div className="text-xs font-bold text-slate-800 truncate">{event.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case SlideType.PROCESS:
        return (
          <div className="h-full p-8 bg-white flex flex-col">
            <h3 className="text-2xl font-bold mb-6" style={{ color: themeColor }}>{slide.title}</h3>
            <div className="flex-1 flex items-center justify-center gap-2">
                {slide.processSteps?.map((step, i) => (
                    <div key={i} className="flex-1 h-32 relative text-white p-3 flex flex-col items-center text-center clip-path-chevron" 
                         style={{ 
                             backgroundColor: themeColor, 
                             opacity: 1 - (i * 0.15),
                             clipPath: 'polygon(0% 0%, 85% 0%, 100% 50%, 85% 100%, 0% 100%, 15% 50%)',
                             marginLeft: i === 0 ? 0 : '-15px',
                             paddingLeft: i === 0 ? '12px' : '24px' // Adjust for chevron overlap
                         }}>
                        <div className="text-2xl font-bold mb-1 opacity-50">{i + 1}</div>
                        <div className="text-xs font-bold leading-tight mb-1">{step.title}</div>
                        <div className="text-[9px] opacity-80 leading-tight line-clamp-2">{step.description}</div>
                    </div>
                ))}
            </div>
          </div>
        );

      default: // Text Only
        return (
          <div className="h-full p-8 bg-white flex flex-col">
            <h3 className="text-2xl font-bold mb-2" style={{ color: themeColor }}>{slide.title}</h3>
            <div className="w-full h-0.5 bg-slate-200 mb-6"></div>
            <div className="flex-1 flex flex-col justify-start">
              <ul className="space-y-4">
                {slide.bullets?.map((b, i) => (
                  <li key={i} className="flex items-start text-base text-slate-700">
                    <span className="mr-3 mt-1.5 w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: themeColor }}></span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="group relative w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="w-full bg-slate-100" style={slideStyle}>
        {renderContent()}
      </div>
      <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
        <span>Slide {index + 1}</span>
        <span className="w-1 h-1 rounded-full bg-white/50"></span>
        <span>{slide.type}</span>
      </div>
    </div>
  );
};

export default SlidePreview;
