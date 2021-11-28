import { Box } from '@mui/system';
import { NextPage } from 'next';
import { NotFound } from '~/components/parts/layout/NotFound';
import { ProecoOgpHead } from '~/components/parts/layout/ProecoOgpHead';

const Custom404: NextPage = () => {
  return (
    <>
      <ProecoOgpHead />
      <Box mt="100px">
        <NotFound />
      </Box>
    </>
  );
};

export default Custom404;