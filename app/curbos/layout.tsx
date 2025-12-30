import { getLatestRelease } from '@/lib/github-release';
import { logger } from '@/lib/logger';
import CurbOSLayoutClient from './CurbOSLayoutClient';

export const revalidate = 300; // Revalidate every 5 minutes

export default async function CurbOSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let releaseData = null;

  try {
    releaseData = await getLatestRelease();
  } catch (error) {
    logger.error('[CurbOS Layout] Failed to fetch release data:', error);
  }

  return (
    <CurbOSLayoutClient releaseData={releaseData}>
      {children}
    </CurbOSLayoutClient>
  );
}
