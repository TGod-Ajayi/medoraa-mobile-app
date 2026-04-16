import * as SecureStore from 'expo-secure-store';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { Platform } from 'react-native';

/** Matches routes in `(verification)/index` ITEMS. */
export type VerificationSectionId =
  | 'id-documents'
  | 'medical-qualification'
  | 'physical-clinic';

export const VERIFICATION_TOTAL_STEPS = 3;

const STORAGE_KEY = 'doctor_verification_completed_sections_v1';

const ALL_SECTIONS: VerificationSectionId[] = [
  'id-documents',
  'medical-qualification',
  'physical-clinic',
];

function isSectionId(v: unknown): v is VerificationSectionId {
  return (
    typeof v === 'string' &&
    (ALL_SECTIONS as string[]).includes(v)
  );
}

type VerificationProgressValue = {
  /** Ready after hydrating from storage (optional: avoid flash). */
  ready: boolean;
  completed: VerificationSectionId[];
  /** Number of segments filled in `AuthStepper` (1…VERIFICATION_TOTAL_STEPS). */
  currentStep: number;
  markComplete: (section: VerificationSectionId) => Promise<void>;
  isComplete: (section: VerificationSectionId) => boolean;
};

const VerificationProgressContext = createContext<
  VerificationProgressValue | undefined
>(undefined);

async function loadStored(): Promise<VerificationSectionId[]> {
  if (Platform.OS === 'web') return [];
  try {
    const raw = await SecureStore.getItemAsync(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isSectionId);
  } catch {
    return [];
  }
}

async function persist(sections: VerificationSectionId[]): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(sections));
  } catch {
    // ignore
  }
}

export function VerificationProgressProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [completed, setCompleted] = useState<VerificationSectionId[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const stored = await loadStored();
      if (!cancelled) {
        setCompleted(stored);
        setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const markComplete = useCallback(async (section: VerificationSectionId) => {
    setCompleted((prev) => {
      if (prev.includes(section)) return prev;
      const next = [...prev, section];
      void persist(next);
      return next;
    });
  }, []);

  const isComplete = useCallback(
    (section: VerificationSectionId) => completed.includes(section),
    [completed]
  );

  const currentStep = useMemo(
    () =>
      Math.min(
        1 + completed.length,
        VERIFICATION_TOTAL_STEPS
      ),
    [completed.length]
  );

  const value = useMemo(
    () => ({
      ready,
      completed,
      currentStep,
      markComplete,
      isComplete,
    }),
    [ready, completed, currentStep, markComplete, isComplete]
  );

  return (
    <VerificationProgressContext.Provider value={value}>
      {children}
    </VerificationProgressContext.Provider>
  );
}

export function useVerificationProgress(): VerificationProgressValue {
  const ctx = useContext(VerificationProgressContext);
  if (!ctx) {
    throw new Error(
      'useVerificationProgress must be used within VerificationProgressProvider'
    );
  }
  return ctx;
}
