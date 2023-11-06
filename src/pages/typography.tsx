import { Typography } from '@/components/common';

const TypographyPage = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        maxWidth: '960px',
        margin: 'auto',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '1rem',
        }}
      >
        <Typography variant="h1/bold">h1/bold</Typography>
        <Typography variant="h1/medium">h1/medium</Typography>
        <Typography variant="h1/regular">h1/regular</Typography>
        <Typography variant="h2/bold">h2/bold</Typography>
        <Typography variant="h2/medium">h2/medium</Typography>
        <Typography variant="h2/regular">h2/regular</Typography>
        <Typography variant="h3/bold">h3/bold</Typography>
        <Typography variant="h3/medium">h3/medium</Typography>
        <Typography variant="h3/regular">h3/regular</Typography>
        <Typography variant="h4/bold">h4/bold</Typography>
        <Typography variant="h4/medium">h4/medium</Typography>
        <Typography variant="h4/regular">h4/regular</Typography>
        <Typography variant="h5/bold">h5/bold</Typography>
        <Typography variant="h5/medium">h5/medium</Typography>
        <Typography variant="h5/regular">h5/regular</Typography>
        <Typography variant="h6/bold">h6/bold</Typography>
        <Typography variant="h6/medium">h6/medium</Typography>
        <Typography variant="h6/regular">h6/regular</Typography>
      </div>
      <div>
        <hr style={{ border: '1px solid #000' }} />
      </div>

      <pre style={{ fontFamily: '"Monaco", Monaco, monospace' }}>
        {'<Typography variant="h1/bold">A Heading</Typography>'}
      </pre>
      <Typography variant="h1/bold">A Heading</Typography>

      <pre style={{ fontFamily: '"Monaco", Monaco, monospace' }}>
        {'<Typography variant="h2/bold/div">A Heading That is a Div</Typography>'}
      </pre>
      <Typography variant="h2/bold/div">A Heading That is a Div</Typography>

      <pre style={{ fontFamily: '"Monaco", Monaco, monospace' }}>
        {'<Typography variant="h4" weight="medium" component="p">'}
      </pre>
      <Typography variant="h4" weight="medium" component="p">
        Setting props individually
      </Typography>

      <pre style={{ fontFamily: '"Monaco", Monaco, monospace' }}>
        {
          "<Typography variant=\"h4/bold\" style={{ color: 'green' }} onClick={() => window.alert('hey!')}>"
        }
      </pre>
      <Typography variant="h4/bold" style={{ color: 'green' }} onClick={() => window.alert('hey!')}>
        Setting other props on the component
      </Typography>
    </div>
  );
};

export default TypographyPage;
