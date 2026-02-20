import ProjectCardsGrid from '../components/ProjectCardsGrid';
import MasterLog from '../components/MasterLog';
import StatusBanners from '../components/StatusBanners';

export default function Home() {
  return (
    <div className="space-y-6">
      <StatusBanners />
      <ProjectCardsGrid />
      <MasterLog selectedPriority={null} />
    </div>
  );
}