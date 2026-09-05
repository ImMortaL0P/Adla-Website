import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Seo } from '@/components/common/Seo';
import { Image as ImageIcon, Users, FileText, Bell, ImagePlus } from 'lucide-react';
import NoticesTab from './tabs/NoticesTab';
import ImagesTab from './tabs/ImagesTab';
import GalleryTab from './tabs/GalleryTab';
import StaffTab from './tabs/StaffTab';
import ContentTab from './tabs/ContentTab';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'notices' | 'images' | 'gallery' | 'staff' | 'content'>('notices');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  const tabs = [
    { id: 'notices', label: 'Notices', icon: Bell },
    { id: 'gallery', label: 'Gallery', icon: ImagePlus },
    { id: 'images', label: 'System Images', icon: ImageIcon },
    { id: 'staff', label: 'Staff Directory', icon: Users },
    { id: 'content', label: 'Admission & Text', icon: FileText },
  ] as const;

  return (
    <>
      <Seo titleKey="Admin Dashboard" path="/admin/dashboard" />
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <SectionHeading title="Admin Dashboard" level={1} />
          <button onClick={handleLogout} className="self-start sm:self-auto rounded-md bg-red-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-red-600">
            Logout
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 flex overflow-x-auto scrollbar-hide space-x-2 border-b border-[hsl(var(--border))]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex shrink-0 whitespace-nowrap items-center gap-2 px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'border-b-2 border-[hsl(var(--primary-strong))] text-[hsl(var(--primary-strong))]'
                  : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'notices' && <NoticesTab />}
          {activeTab === 'gallery' && <GalleryTab />}
          {activeTab === 'images' && <ImagesTab />}
          {activeTab === 'staff' && <StaffTab />}
          {activeTab === 'content' && <ContentTab />}
        </div>
      </div>
    </>
  );
}
