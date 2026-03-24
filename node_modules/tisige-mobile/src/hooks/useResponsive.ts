import { useMemo } from 'react';
import { Platform, useWindowDimensions } from 'react-native';

/** Larguras de referência para layout web/desktop. */
export const BP = {
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

export function useResponsive() {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    const isWeb = Platform.OS === 'web';
    const isTabletUp = width >= BP.md;
    const isDesktop = width >= BP.lg;
    const isWide = width >= BP.xl;

    /** Largura útil máxima do conteúdo (centralizado). */
    let maxContent = 560;
    if (width >= BP.xl) maxContent = 1100;
    else if (width >= BP.lg) maxContent = 960;
    else if (width >= BP.md) maxContent = 720;

    /** Padding horizontal externo em telas muito largas. */
    const gutter = isWeb ? Math.min(48, Math.max(16, (width - maxContent) / 2)) : 16;

    return {
      width,
      height,
      isWeb,
      isTabletUp,
      isDesktop,
      isWide,
      maxContent,
      gutter,
      /** Colunas para grid de cards (home, etc.) */
      menuColumns: isDesktop ? 2 : 1,
      /** Lista Controle LC em 2 colunas só em telas largas */
      listColumns: width >= BP.lg ? 2 : 1,
    };
  }, [width, height]);
}
