import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Box } from '@mui/system';

import { action } from '@storybook/addon-actions';
import { SkeltonTeamCard, TeamCard } from './TeamCard';
import { createMockTeam } from '~/mock';

export default {
  title: 'domains/team/TeamCard',
  component: TeamCard,
} as ComponentMeta<typeof TeamCard>;

const Template: ComponentStory<typeof TeamCard> = ({ ...rest }) => {
  return (
    <Box p="40px" bgcolor="#e5e5e5">
      <TeamCard {...rest}></TeamCard>
    </Box>
  );
};

const mockTeam = createMockTeam({ name: 'Proeco', iconImage: 'https://itizawa-tech.growi.cloud/attachment/616289c6c4e99c0051b30574' });
const mockTeamWithoutImage = createMockTeam({ name: 'Proeco' });
const mockLongTextTeam = createMockTeam({
  ...mockTeam,
  description: 'Proeco は頑張る人を応援するプラットフォームです。プロジェクトを作って Story を作ることで',
});

export const DefaultTeamCard = Template.bind({});
DefaultTeamCard.args = {
  team: mockTeam,
  onClick: action('clickTeamCard'),
};

export const LongTextTeamCard = Template.bind({});
LongTextTeamCard.args = {
  ...DefaultTeamCard.args,
  team: mockLongTextTeam,
};

export const TeamCardWithoutImage = Template.bind({});
TeamCardWithoutImage.args = {
  ...DefaultTeamCard.args,
  team: mockTeamWithoutImage,
};

export const LoadingTeamCard = Template.bind({});
LoadingTeamCard.args = {
  ...DefaultTeamCard.args,
};

const SkeltonTemplate: ComponentStory<typeof SkeltonTeamCard> = ({ ...rest }) => {
  return (
    <Box p="40px" bgcolor="#e5e5e5">
      <SkeltonTeamCard {...rest}></SkeltonTeamCard>
    </Box>
  );
};

export const Skelton = SkeltonTemplate.bind({});