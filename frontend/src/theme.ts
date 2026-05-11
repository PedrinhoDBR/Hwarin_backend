export type ThemeMode = 'light' | 'dark';

export interface BrandPalette {
  primary: string;
  primaryTransparente: string;
  secondary: string;
  fontTitle: string;
  fontColor: string;
  background: string;
  paper: string;
  surface: string;
  border: string;
  inputBg: string;
  sparkle: string;
  accentGradient: string;
  overlayDark: string;
}

export interface AppTheme {
  mode: ThemeMode;
  brand: BrandPalette;
  text: {
    primary: string;
    secondary: string;
  };
  background: {
    default: string;
    paper: string;
    surface: string;
  };
  radius: number;
  fontFamily: string;
  typography: {
    h1Weight: number;
    h5Weight: number;
    body2Size: string;
    buttonWeight: number;
  };
}

function toRgb(color: string): string | null {
  const normalized = color.trim();

  if (normalized.startsWith('#')) {
    const hex = normalized.slice(1);
    const safeHex = hex.length === 3
      ? hex.split('').map((character) => `${character}${character}`).join('')
      : hex;

    if (safeHex.length !== 6) {
      return null;
    }

    const value = Number.parseInt(safeHex, 16);
    const red = (value >> 16) & 255;
    const green = (value >> 8) & 255;
    const blue = value & 255;

    return `${red}, ${green}, ${blue}`;
  }

  const rgbMatch = normalized.match(/rgba?\(([^)]+)\)/i);
  if (!rgbMatch) {
    return null;
  }

  return rgbMatch[1]
    .split(',')
    .slice(0, 3)
    .map((part) => part.trim())
    .join(', ');
}

export function alpha(color: string, opacity: number): string {
  const rgb = toRgb(color);
  if (!rgb) {
    return color;
  }

  return `rgba(${rgb}, ${opacity})`;
}

export function createAppTheme(mode: ThemeMode): AppTheme {
  const darkMode = mode === 'dark';

  const brand: BrandPalette = {
    primary: darkMode ? '#311B65' : '#be1eb1',
    primaryTransparente: darkMode ? '#311b658a' : '#be1eb1',
    secondary: '#982196',
    fontTitle: '#F2D5D9',
    fontColor: '#ffffff',
    background: darkMode ? '#020205' : '#F9FAFB',
    paper: darkMode ? '#0C0C0E' : '#FFFFFF',
    surface: darkMode ? 'rgba(15, 12, 26, 0.65)' : 'rgba(255, 255, 255, 0.75)',
    border: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
    inputBg: darkMode ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.5)',
    sparkle: '#d966f5',
    accentGradient: 'linear-gradient(135deg, #be1eb1 0%, #6a0dad 100%)',
    overlayDark: 'linear-gradient(to top, rgba(5,2,18,0.95) 0%, transparent 60%)',
  };

  return {
    mode,
    brand,
    text: {
      primary: darkMode ? '#E4E4E7' : '#111827',
      secondary: darkMode ? '#A1A1AA' : '#6B7280',
    },
    background: {
      default: brand.background,
      paper: brand.paper,
      surface: brand.surface,
    },
    radius: 12,
    fontFamily: "'Inter','Plus Jakarta Sans','system-ui','-apple-system',sans-serif",
    typography: {
      h1Weight: 800,
      h5Weight: 600,
      body2Size: '0.85rem',
      buttonWeight: 600,
    },
  };
}

const defaultTheme = createAppTheme('dark');

export default defaultTheme;