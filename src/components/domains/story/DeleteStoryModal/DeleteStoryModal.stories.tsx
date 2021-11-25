import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Box } from '@mui/system';
import { Component } from './DeleteStoryModal';

export default {
  title: 'domains/story/DeleteStoryModal',
  component: Component,
  argTypes: {
    onCloseModal: { action: 'onCloseModal' },
    onClickDeleteStoryButton: { action: 'onClickDeleteStoryButton' },
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
  return (
    <Box>
      <Component {...args} />
    </Box>
  );
};

export const OpenModal = Template.bind({});
OpenModal.args = {
  isOpen: true,
  title: 'Webevのコメント機能を開発する',
  emojiId: 'wrench',
};
