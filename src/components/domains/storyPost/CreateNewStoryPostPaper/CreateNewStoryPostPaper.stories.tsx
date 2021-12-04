import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Box } from '@mui/system';

import { CreateNewStoryPostPaper } from '~/components/domains/storyPost/CreateNewStoryPostPaper';

export default {
  title: 'domains/storyPost/CreateNewStoryPostPaper',
  component: CreateNewStoryPostPaper,
} as ComponentMeta<typeof CreateNewStoryPostPaper>;

const Template: ComponentStory<typeof CreateNewStoryPostPaper> = ({ storyId, page }) => {
  return (
    <Box p="40px" bgcolor="#e5e5e5" width="600px">
      <CreateNewStoryPostPaper storyId={storyId} page={page} />
    </Box>
  );
};

export const DefaultCard = Template.bind({});
DefaultCard.args = {
  storyId: 'story1',
  page: 1,
};
