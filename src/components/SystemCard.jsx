import React from 'react';

const SystemCard = ({ icon, title, description, colorClass, colorHex, url, imageUrl, viewMode = 'grid' }) => {
  const isEmojiStr = (str) => /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u.test(str || '');
  const extractColor = (cls) => cls?.match(/text-\[(#[0-9a-fA-F]{6})\]/)?.[1];
  const iconColor = colorHex || extractColor(colorClass) || 'var(--color-primary)';
  const isExternal = url && (url.startsWith('http://') || url.startsWith('https://'));
  const targetUrl = url || '#';

  if (viewMode === 'list') {
    return (
      <a
        href={targetUrl}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className="bg-white/70 backdrop-blur-md rounded-xl p-3 border border-white/40 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative group flex flex-row items-center cursor-pointer text-left no-underline gap-4"
      >
        {/* Status Check indicator */}
        <span className="material-symbols-outlined text-[18px] text-primary bg-white rounded-full p-0.5 select-none shrink-0 shadow-sm">
          check_circle
        </span>

        {/* Icon Area */}
        <div className="w-10 h-10 flex items-center justify-center shrink-0 overflow-hidden">
          {imageUrl ? (
            <img src={imageUrl} alt="icon" className="w-full h-full object-cover rounded-lg" />
          ) : (
            <span 
              className={`${isEmojiStr(icon) ? '' : 'material-symbols-outlined'} text-[24px] select-none`}
              style={isEmojiStr(icon) ? {} : { color: iconColor }}
            >
              {icon || 'grid_view'}
            </span>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <h3 className="font-headline-md text-[14px] text-on-surface mb-0.5 truncate font-bold">{title}</h3>
          <div className="hidden md:block">
            <p className="font-label-sm text-[11px] text-on-surface/70 truncate">{description}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {url && (
            <div className="text-on-surface/40 group-hover:text-primary transition-colors duration-200">
              <span className="material-symbols-outlined text-[18px] select-none">open_in_new</span>
            </div>
          )}
          <div className="inline-flex items-center justify-center gap-1 text-primary font-label-md text-[11px] font-bold group-hover:translate-x-1 transition-transform bg-white/50 px-2.5 py-1 rounded-full shadow-sm">
            เข้าใช้งาน <span className="material-symbols-outlined text-[14px] select-none">arrow_forward</span>
          </div>
        </div>
      </a>
    );
  }

  // Default Grid View
  return (
    <a
      href={targetUrl}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="bg-white/70 backdrop-blur-md rounded-xl p-4 border border-white/40 shadow-[0px_4px_20px_rgba(15,23,42,0.05)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group flex flex-col items-center cursor-pointer text-center no-underline h-full"
    >
      {/* Check indicator */}
      <div className="absolute top-4 left-4">
        <span className="material-symbols-outlined text-[16px] text-primary bg-white rounded-full p-0.5 select-none shadow-sm">
          check_circle
        </span>
      </div>

      {/* External Link indicator */}
      {url && (
        <div className="absolute top-4 right-4 text-on-surface/40 group-hover:text-primary transition-colors duration-200">
          <span className="material-symbols-outlined text-[18px] select-none">open_in_new</span>
        </div>
      )}

      {/* Top Half: Icon Area */}
      <div className="w-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 pt-2 pb-4 shrink-0">
        <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center overflow-hidden">
          {imageUrl ? (
            <img src={imageUrl} alt="icon" className="w-full h-full object-cover rounded-2xl shadow-sm" />
          ) : (
            <span 
              className={`${isEmojiStr(icon) ? '' : 'material-symbols-outlined'} text-[56px] md:text-[64px] select-none`}
              style={isEmojiStr(icon) ? {} : { color: iconColor }}
            >
              {icon || 'grid_view'}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Half: Content Area */}
      <div className="flex flex-col items-center justify-start w-full flex-1 min-h-0">
        <h3 className="font-headline-md text-[15px] md:text-[16px] text-on-surface mb-2 line-clamp-2 font-bold w-full leading-tight shrink-0">{title}</h3>
        <div className="hidden md:block w-full mb-3 shrink-0">
          <p className="font-label-sm text-[11px] md:text-[12px] leading-snug text-on-surface/70 line-clamp-2 w-full">{description}</p>
        </div>
        
        {/* Action Button at Bottom */}
        <div className="mt-auto w-full flex justify-center pt-1 pb-1 shrink-0">
          <div className="inline-flex items-center justify-center gap-1 text-primary font-label-md text-[10px] md:text-[11px] font-bold group-hover:gap-2 transition-all bg-white/60 px-3 py-1.5 rounded-full shadow-sm">
            เข้าใช้งาน <span className="material-symbols-outlined text-[14px] select-none">arrow_forward</span>
          </div>
        </div>
      </div>
    </a>
  );
};

export default SystemCard;
