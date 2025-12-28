import React from 'react';

const Tabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="w-full">
      <div className="relative border-b-2 border-foreground/40 mb-4">
        <nav className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`relative pt-2 pb-4 px-2 md:px-6 text-md font-semibold transition-all duration-100 ${activeTab === tab.name ? 'text-accent' : ''}`}
            >
              <span className="relative z-10">{tab.label}</span>
              {activeTab === tab.name && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-primary to-accent rounded-full shadow-lg " />
              )}
              {activeTab === tab.name && (
                <div className="absolute inset-0 bg-linear-to-r from-slate-800 to-slate-900/50 rounded-t-lg -z-10" />
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="py-6">
        {tabs.map((tab) => {
          if (tab.name === activeTab) {
            return (
              <div className="animate-in fade-in duration-300" key={tab.name}>
                {tab.content}
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default Tabs;
