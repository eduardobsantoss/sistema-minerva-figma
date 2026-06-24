import { useState } from 'react';
import { LoginScreen } from '@/features/auth';
import { ModulesScreen } from './ModulesScreen';

// If a ?view= param is present, skip the login screen for capture purposes
const SKIP_LOGIN = new URLSearchParams(window.location.search).has('view');

export default function App() {
  const [screen, setScreen] = useState<'login' | 'modules'>(
    SKIP_LOGIN ? 'modules' : 'login',
  );

  return (
    <div className="size-full">
      {screen === 'login' ? (
        <LoginScreen onSubmit={() => setScreen('modules')} />
      ) : (
        <ModulesScreen />
      )}
    </div>
  );
}
