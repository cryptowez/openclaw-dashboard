interface TabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div className="flex border-b border-gray-800">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-4 py-2 -mb-px ${
            activeTab === tab
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}