import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Box } from '@mui/system';
import { Typography } from '~/components/parts/commons/atoms';
import { Paper } from '~/components/parts/commons/atoms/Paper';

export default {
  title: 'parts/commons/atoms/Paper',
  component: Paper,
} as ComponentMeta<typeof Paper>;

const Template: ComponentStory<typeof Paper> = ({ ...rest }) => {
  return (
    <Box p="40px" bgcolor="gray">
      <Paper {...rest}>
        <Typography variant="body1">Paperのコンテンツ</Typography>
      </Paper>
    </Box>
  );
};

export const DefaultCard = Template.bind({});
DefaultCard.args = {
  square: false,
};

export const SquareCard = Template.bind({});
SquareCard.args = {
  square: true,
};
