import Link from 'next/link';
import { CSSProperties, HTMLAttributes, PropsWithChildren } from 'react';

// v1 variants
const HEADINGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;
type Heading = (typeof HEADINGS)[number];

type V1Weight = 'bold' | 'medium' | 'regular';

type V1Variant = `${Heading}/${V1Weight}`;

// v2 variants
type V2StandardStyle = 'title' | 'label' | 'body';
type V2WeightedStyle = 'display' | 'headline';
type V2Weight = 'light' | 'heavy';
type V2Size = 'large' | 'medium' | 'small';

type V2StandardVariant = `${V2StandardStyle}/${V2Size}`;
type V2WeightedVariant = `${V2WeightedStyle}/${V2Weight}/${V2Size}`;
type V2Variant = V2StandardVariant | V2WeightedVariant;

function isStandardVariant(variant: V2Variant): variant is V2StandardVariant {
  return variant.split('/').length === 2;
}

// shared
type Variant = V1Variant | V2Variant;

type ComponentType = Heading | 'p' | 'span' | 'div';

function isV1Variant(variant: Variant): variant is V1Variant {
  return HEADINGS.some(h => h === variant.split('/')[0]);
}

interface TypographyProps extends HTMLAttributes<HTMLElement> {
  variant: Variant;
  component?: ComponentType;
  style?: CSSProperties;
  // This is used if/when the component is 'a'.
  href?: string;
}

// Implements styles from https://www.figma.com/file/ihJGLgfFTURKCgl9KNUPcA/Website-%26-Portal%3A-Design-System?node-id=1561%3A263&mode=dev
const v1Sizes: Record<Heading, string> = {
  h1: '2rem',
  h2: '1.75rem',
  h3: '1.5rem',
  h4: '1.375rem',
  h5: '1rem',
  h6: '0.875rem',
};

const v1Heights: Record<Heading, string> = {
  h1: '2.5rem',
  h2: '2.25rem',
  h3: '2rem',
  h4: '1.75rem',
  h5: '1.5rem',
  h6: '1.25rem',
};

const v1Spacings: Partial<Record<Heading, string>> = {
  h1: '0.02rem',
  h2: '0.0175rem',
  h3: '0.015rem',
};

const v1Weights: Record<V1Weight, number> = {
  bold: 700,
  medium: 500,
  regular: 400,
};

// Implements styles from https://www.figma.com/file/KQNb1Z6MT1GBxIuoQrChGK/Diamond-Design-System?node-id=27%3A485&mode=dev
const v2StandardSizes: Record<V2StandardStyle, Record<V2Size, string>> = {
  title: {
    large: '1.8125rem',
    medium: '1.625rem',
    small: '1.4375rem',
  },
  label: {
    large: '1.25rem',
    medium: '1.125rem',
    small: '1rem',
  },
  body: {
    large: '1.125rem',
    medium: '1rem',
    small: '0.875rem',
  },
};

const v2StandardHeights: Record<V2StandardStyle, Record<V2Size, string>> = {
  title: {
    large: '2.375rem',
    medium: '2.125rem',
    small: '1.875rem',
  },
  label: {
    large: '1.625rem',
    medium: '1.5rem',
    small: '1.375rem',
  },
  body: {
    large: '1.5rem',
    medium: '1.3125rem',
    small: '1.125rem',
  },
};

const v2StandardSpacings: Partial<Record<V2StandardStyle, Partial<Record<V2Size, string>>>> = {
  label: {
    medium: '0.03125rem',
    small: '0.03125rem',
  },
  body: {
    large: '0.03125rem',
    medium: '0.01563rem',
    small: '0.025rem',
  },
};

const v2StandardWeights: Record<V2StandardStyle, number> = {
  title: 400,
  label: 400,
  body: 400,
};

const v2WeightedSizes: Record<V2WeightedStyle, Record<V2Size, string>> = {
  display: {
    large: '4.125rem',
    medium: '3.25rem',
    small: '2.875rem',
  },
  headline: {
    large: '2.625rem',
    medium: '2.5625rem',
    small: '2.25rem',
  },
};

const v2WeightedHeights: Record<V2WeightedStyle, Record<V2Size, string>> = {
  display: {
    large: '5.375rem',
    medium: '4.25rem',
    small: '3.75rem',
  },
  headline: {
    large: '3.3125rem',
    medium: '2.9375rem',
    small: '2.625rem',
  },
};

const v2WeightedSpacings: Record<V2WeightedStyle, Record<V2Size, string>> = {
  display: {
    large: '-0.0625rem',
    medium: '-0.03125rem',
    small: '-0.01563rem',
  },
  headline: {
    large: '-0.01563rem',
    medium: '-0.01563rem',
    small: 'normal',
  },
};

const v2WeightedWeights: Record<V2WeightedStyle, Record<V2Weight, Record<V2Size, number>>> = {
  display: {
    light: {
      large: 200,
      medium: 200,
      small: 300,
    },
    heavy: {
      large: 800,
      medium: 700,
      small: 600,
    },
  },
  headline: {
    light: {
      large: 400,
      medium: 400,
      small: 400,
    },
    heavy: {
      large: 600,
      medium: 600,
      small: 600,
    },
  },
};

const variantToCSS = (variant: Variant): CSSProperties => {
  if (isV1Variant(variant)) {
    const [style, weight] = variant.split('/') as [Heading, V1Weight];
    return {
      fontSize: v1Sizes[style],
      lineHeight: v1Heights[style],
      letterSpacing: v1Spacings[style] ?? 'normal',
      fontWeight: v1Weights[weight],
    };
  }
  if (isStandardVariant(variant)) {
    const [style, size] = variant.split('/') as [V2StandardStyle, V2Size];
    return {
      fontSize: v2StandardSizes[style][size],
      lineHeight: v2StandardHeights[style][size],
      letterSpacing: v2StandardSpacings[style]?.[size] ?? 'normal',
      fontWeight: v2StandardWeights[style],
    };
  }
  const [style, weight, size] = variant.split('/') as [V2WeightedStyle, V2Weight, V2Size];
  return {
    fontSize: v2WeightedSizes[style][size],
    lineHeight: v2WeightedHeights[style][size],
    letterSpacing: v2WeightedSpacings[style][size],
    fontWeight: v2WeightedWeights[style][weight][size],
  };
};

/**
 * Typography component applies h1-h6 styles from Diamond Design System.
 *
 * https://www.figma.com/file/ihJGLgfFTURKCgl9KNUPcA/Website-%26-Portal%3A-Design-System?node-id=1561%3A263&mode=dev
 * @param props
 * @param props.variant - variant as specified by Diamond Design System, e.g. `h1/bold`, `title/large`, `display/light/small`
 * @param props.component - the actual semantic element, e.g. `h1`, `p`, `div`
 * @param props.style - style prop for JSX component
 * @returns styled typography component
 */
const Typography = (props: PropsWithChildren<TypographyProps>) => {
  const { variant, component, style, children, ...restProps } = props;

  if (restProps.href) {
    return (
      <Link
        href={restProps.href}
        style={{
          ...variantToCSS(variant),
          ...style, // other styles can be customized via style prop
        }}
        {...restProps}
      >
        {children}
      </Link>
    );
  }

  const Component = component || 'div';

  return (
    <Component
      style={{
        ...variantToCSS(variant),
        ...style, // other styles can be customized via style prop
      }}
      {...restProps}
    >
      {children}
    </Component>
  );
};

export default Typography;
