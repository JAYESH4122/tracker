import { HomeScreen } from '../../src/features/home/HomeScreen';
import { useRouter } from 'expo-router';

const TAB_MAP: Record<string, string> = {
  log: '/workout',
  planner: '/planner',
  analytics: '/analytics',
  profile: '/profile',
};

export default function HomeTab() {
  const router = useRouter();
  return (
    <HomeScreen
      onNavigate={(tab) => {
        const path = TAB_MAP[tab];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (path) router.push(path as any);
      }}
    />
  );
}