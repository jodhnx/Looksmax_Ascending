export interface RuntimeConfig {
  freeAnalysisLimit: number;
  freePlanDays: number;
  premiumEnabled: boolean;
  premiumPrice: string;
}

const DEFAULT_CONFIG: RuntimeConfig = {
  freeAnalysisLimit: 1,
  freePlanDays: 7,
  premiumEnabled: true,
  premiumPrice: "$14.99/mo",
};

let memoryConfig: RuntimeConfig = { ...DEFAULT_CONFIG };

export function getRuntimeConfig(): RuntimeConfig {
  if (process.env.APP_CONFIG) {
    try {
      return { ...DEFAULT_CONFIG, ...JSON.parse(process.env.APP_CONFIG) };
    } catch {
      /* use memory */
    }
  }
  return memoryConfig;
}

export function setRuntimeConfig(config: Partial<RuntimeConfig>): RuntimeConfig {
  memoryConfig = { ...memoryConfig, ...config };
  return memoryConfig;
}
