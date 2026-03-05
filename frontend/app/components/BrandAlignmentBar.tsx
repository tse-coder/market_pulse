import React from "react";

export default function BrandAlignmentBar() {
  return (
    <div className="absolute bottom-12 left-0 right-0 flex justify-center items-center flex-wrap gap-x-12 gap-y-6 px-6 z-10 opacity-40">
      <div className="flex items-center gap-2 grayscale contrast-150">
        <img
          src="/brand-icons/reddit/icon-primary.jpeg"
          alt="Reddit"
          className="w-4 h-4 rounded-sm"
        />
        <span className="text-[10px] font-black uppercase tracking-widest">
          Reddit
        </span>
      </div>
      <div className="flex items-center gap-2 grayscale contrast-150">
        <img
          src="/brand-icons/hacker-news/icon-primary.jpeg"
          alt="Hacker News"
          className="w-4 h-4 rounded-sm"
        />
        <span className="text-[10px] font-black uppercase tracking-widest">
          Hacker News
        </span>
      </div>
      <div className="flex items-center gap-2 grayscale contrast-150">
        <img
          src="/brand-icons/product-hunt/icon-primary.png"
          alt="Product Hunt"
          className="w-4 h-4 rounded-sm"
        />
        <span className="text-[10px] font-black uppercase tracking-widest">
          Product Hunt
        </span>
      </div>
      <div className="flex items-center gap-2 grayscale contrast-150">
        <img
          src="/brand-icons/github/GitHub_Logo_1.png"
          alt="GitHub"
          className="w-4 h-4 rounded-sm"
        />
        <span className="text-[10px] font-black uppercase tracking-widest">
          GitHub
        </span>
      </div>
      <div className="flex items-center gap-2 grayscale contrast-150">
        <img
          src="/brand-icons/discord/icon-no-bg.png"
          alt="Discord"
          className="w-4 h-4 rounded-sm"
        />
        <span className="text-[10px] font-black uppercase tracking-widest">
          Discord
        </span>
      </div>
      <div className="flex items-center gap-2 grayscale contrast-150">
        <img
          src="/brand-icons/x/icon-no-bg.png"
          alt="X"
          className="w-4 h-4 rounded-sm"
        />
        <span className="text-[10px] font-black uppercase tracking-widest">
          Twitter
        </span>
      </div>
      <div className="flex items-center gap-2 grayscale contrast-150">
        <img
          src="/brand-icons/LinkedIn/LinkedIn_Logo_1.png"
          alt="LinkedIn"
          className="w-4 h-4 rounded-sm"
        />
        <span className="text-[10px] font-black uppercase tracking-widest">
          LinkedIn
        </span>
      </div>
      <div className="flex items-center gap-2 grayscale contrast-150">
        <img
          src="/brand-icons/telegram/Telegram_Logo_1.png"
          alt="Telegram"
          className="w-4 h-4 rounded-sm"
        />
        <span className="text-[10px] font-black uppercase tracking-widest">
          Telegram
        </span>
      </div>
      <div className="flex items-center gap-2 grayscale contrast-150">
        <img
          src="/brand-icons/youtube/YouTube_Logo_1.png"
          alt="YouTube"
          className="w-4 h-4 rounded-sm"
        />
        <span className="text-[10px] font-black uppercase tracking-widest">
          YouTube
        </span>
      </div>
    </div>
  );
}
