import React, { useState } from 'react';
import {
  Bell,
  Moon,
  Sun,
  Palette,
  Shield,
  Globe,
  Calendar,
  Clock,
  Cloud,
  Bell as BellIcon,
  Smartphone,
  Vibrate,
  Mail,
  Radio,
  Zap,
  Layout,
  Eye,
  CheckCircle,
  X,
  ChevronRight,
  Languages,
  Keyboard,
} from 'lucide-react';

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-lg font-semibold mb-4">{title}</h2>
    <div className="space-y-4">{children}</div>
  </div>
);

interface SettingsItemProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  title,
  description,
  action,
}) => (
  <div className="flex items-center justify-between p-4 bg-white rounded-xl hover:bg-gray-50 transition-colors">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
        {icon}
      </div>
      <div>
        <h3 className="font-medium">{title}</h3>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
    </div>
    {action}
  </div>
);

const Switch: React.FC<{ checked: boolean; onChange: () => void }> = ({
  checked,
  onChange,
}) => (
  <button
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      checked ? 'bg-purple-600' : 'bg-gray-200'
    }`}
    onClick={onChange}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        checked ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

const ColorPicker: React.FC<{ colors: string[]; selected: string; onSelect: (color: string) => void }> = ({
  colors,
  selected,
  onSelect,
}) => (
  <div className="flex gap-2">
    {colors.map((color) => (
      <button
        key={color}
        className={`w-6 h-6 rounded-full border-2 ${
          selected === color ? 'border-purple-600' : 'border-transparent'
        }`}
        style={{ backgroundColor: color }}
        onClick={() => onSelect(color)}
      />
    ))}
  </div>
);

export default function SettingsPanel() {
  const [settings, setSettings] = useState({
    theme: 'light',
    accentColor: '#6C5CE7',
    notifications: {
      push: true,
      email: false,
      sound: true,
      mobile: true,
    },
    privacy: {
      publicProfile: false,
      shareProgress: true,
    },
    language: 'English',
  });

  const themeColors = ['#6C5CE7', '#FF6B6B', '#4CAF50', '#2196F3', '#FF9800'];

  const handleNotificationToggle = (key: keyof typeof settings.notifications) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));
  };

  const handlePrivacyToggle = (key: keyof typeof settings.privacy) => {
    setSettings((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: !prev.privacy[key],
      },
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Settings</h1>
          <p className="text-gray-500">Manage your app preferences and account settings</p>
        </div>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 rounded-xl text-white">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Quick Actions</h3>
                  <p className="text-sm text-white/80">Frequently used settings</p>
                </div>
              </div>
              <div className="space-y-3">
                <button className="w-full py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-left px-4">
                  Toggle Dark Mode
                </button>
                <button className="w-full py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-left px-4">
                  Do Not Disturb
                </button>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-xl text-white">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Task Preferences</h3>
                  <p className="text-sm text-white/80">Default task settings</p>
                </div>
              </div>
              <div className="space-y-3">
                <button className="w-full py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-left px-4">
                  Default Duration
                </button>
                <button className="w-full py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-left px-4">
                  Reminders
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 rounded-xl text-white">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Layout className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">View Options</h3>
                  <p className="text-sm text-white/80">Customize your view</p>
                </div>
              </div>
              <div className="space-y-3">
                <button className="w-full py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-left px-4">
                  Calendar View
                </button>
                <button className="w-full py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-left px-4">
                  List View
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          <SettingsSection title="Appearance">
            <SettingsItem
              icon={<Moon className="w-5 h-5" />}
              title="Theme"
              description="Choose between light and dark mode"
              action={
                <Switch
                  checked={settings.theme === 'dark'}
                  onChange={() =>
                    setSettings((prev) => ({
                      ...prev,
                      theme: prev.theme === 'light' ? 'dark' : 'light',
                    }))
                  }
                />
              }
            />
            <SettingsItem
              icon={<Palette className="w-5 h-5" />}
              title="Accent Color"
              description="Choose your preferred accent color"
              action={
                <ColorPicker
                  colors={themeColors}
                  selected={settings.accentColor}
                  onSelect={(color) =>
                    setSettings((prev) => ({ ...prev, accentColor: color }))
                  }
                />
              }
            />
          </SettingsSection>

          <SettingsSection title="Notifications">
            <SettingsItem
              icon={<BellIcon className="w-5 h-5" />}
              title="Push Notifications"
              description="Get notified about updates and reminders"
              action={
                <Switch
                  checked={settings.notifications.push}
                  onChange={() => handleNotificationToggle('push')}
                />
              }
            />
            <SettingsItem
              icon={<Mail className="w-5 h-5" />}
              title="Email Notifications"
              description="Receive updates via email"
              action={
                <Switch
                  checked={settings.notifications.email}
                  onChange={() => handleNotificationToggle('email')}
                />
              }
            />
            <SettingsItem
              icon={<Radio className="w-5 h-5" />}
              title="Sound"
              description="Play sound for notifications"
              action={
                <Switch
                  checked={settings.notifications.sound}
                  onChange={() => handleNotificationToggle('sound')}
                />
              }
            />
          </SettingsSection>

          <SettingsSection title="Privacy">
            <SettingsItem
              icon={<Eye className="w-5 h-5" />}
              title="Public Profile"
              description="Make your profile visible to others"
              action={
                <Switch
                  checked={settings.privacy.publicProfile}
                  onChange={() => handlePrivacyToggle('publicProfile')}
                />
              }
            />
            <SettingsItem
              icon={<Shield className="w-5 h-5" />}
              title="Share Progress"
              description="Allow sharing your task progress"
              action={
                <Switch
                  checked={settings.privacy.shareProgress}
                  onChange={() => handlePrivacyToggle('shareProgress')}
                />
              }
            />
          </SettingsSection>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6">
            <h3 className="font-semibold mb-4">Quick Settings</h3>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-gray-500" />
                  <span>Language</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="text-sm">English</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
              
              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span>Time Zone</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="text-sm">UTC-5</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>

              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Keyboard className="w-5 h-5 text-gray-500" />
                  <span>Shortcuts</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="bg-purple-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Cloud className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">Backup & Sync</h3>
                <p className="text-sm text-gray-500">Last backup: 2 hours ago</p>
              </div>
            </div>
            <button className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Backup Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
