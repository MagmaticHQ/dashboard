import config from '@/config.json';

type Selectors = Record<string, string[]>;

interface Config {
  defaultColor: string;
  selectors: Record<string, Record<string, Selectors>>;
  names: Record<string, string>;
  colors: Record<string, string>;
}

export default config as Config;
