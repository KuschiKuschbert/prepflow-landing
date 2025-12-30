import { getLatestRelease } from '@/lib/github-release';
import { logger } from '@/lib/logger';
import SettingsClient from './SettingsClient';

export const revalidate = 300; // Revalidate every 5 minutes

export default async function CurbOSSettingsPage() {
  let releaseData = null;

  try {
    releaseData = await getLatestRelease();
  } catch (error) {
    logger.error('[CurbOS Settings] Failed to fetch release data:', error);
  }

  return <SettingsClient releaseData={releaseData} />;
}
