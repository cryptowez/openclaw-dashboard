import VaultPanel from '../../components/VaultPanel';
import StatusBanners from '../../components/StatusBanners';

export default function VaultPage() {
  return (
    <div className="space-y-6">
      <StatusBanners />
      <VaultPanel />
    </div>
  );
}