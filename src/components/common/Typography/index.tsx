import { CSSProperties, HTMLAttributes, PropsWithChildren } from 'react';

const HEADINGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;
type Heading = (typeof HEADINGS)[number];

type ComponentType = Heading | 'p' | 'span' | 'div';

type Weight = 'bold' | 'medium' | 'regular';

type HWShorthand = `${Heading}/${Weight}`;

type HWCShorthand = `${Heading}/${Weight}/${ComponentType}`;

type Variant = Heading | HWShorthand | HWCShorthand;

function isHWShorthand(variant: Variant): variant is HWShorthand {
  return variant.split('/').length === 2;
}

function isHWCShorthand(variant: Variant): variant is HWCShorthand {
  return variant.split('/').length === 3;
}

interface TypographyProps extends HTMLAttributes<HTMLElement> {
  variant?: Variant;
  weight?: 'bold' | 'medium' | 'regular';
  component?: ComponentType;
  style?: CSSProperties;
}

// Implements styles from https://www.figma.com/file/ihJGLgfFTURKCgl9KNUPcA/Website-%26-Portal%3A-Design-System?node-id=1561%3A307&mode=dev
const sizeMapping = {
  h1: '2rem',
  h2: '1.75rem',
  h3: '1.5rem',
  h4: '1.375rem',
  h5: '1rem',
  h6: '0.875rem',
};

const heightMapping = {
  h1: '2.5rem',
  h2: '2.25rem',
  h3: '2rem',
  h4: '1.75rem',
  h5: '1.5rem',
  h6: '1.25rem',
};

const spacingMapping: Partial<Record<Heading, string>> = {
  h1: '0.02rem',
  h2: '0.0175rem',
  h3: '0.015rem',
};

const weightMapping = {
  bold: 700,
  medium: 500,
  regular: 400,
};

const Typography = (props: PropsWithChildren<TypographyProps>) => {
  const { style, children, ...restProps } = props;
  let { variant = 'h1', weight = 'regular', component } = props;

  if (isHWShorthand(variant)) {
    [variant, weight] = variant.split('/') as [Heading, Weight];
  } else if (isHWCShorthand(variant)) {
    [variant, weight, component] = variant.split('/') as [Heading, Weight, ComponentType];
  }

  const Component = component || variant;

  return (
    <Component
      style={{
        fontSize: sizeMapping[variant],
        lineHeight: heightMapping[variant],
        letterSpacing: spacingMapping[variant] ?? 'normal',
        fontWeight: weightMapping[weight],
        ...style, // other styles can be customized via style prop
      }}
      {...restProps}
    >
      {children}
    </Component>
  );
};

export default Typography;
