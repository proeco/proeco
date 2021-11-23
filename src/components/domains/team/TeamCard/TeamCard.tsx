import React, { VFC } from 'react';
import { Skeleton } from '@mui/material';
import { Box, styled } from '@mui/system';
import { TeamIcon } from '~/components/domains/team/TeamIcon';
import { Typography, Card } from '~/components/parts/commons';

type Props = {
  teamInfo: {
    teamId: string;
    name: string;
    description: string;
    signedUrl?: string;
  };
  onClick: () => void;
};

export const SkeltonTeamCard: VFC = () => {
  return (
    <StyledTeamCard>
      <Box display="flex" alignItems="center" mb="8px">
        <Box mr="8px">
          <Skeleton variant="circular" width={40} height={40} />
        </Box>
        <Skeleton variant="text" width="100px" />
      </Box>
      <Skeleton variant="text" width="260px" />
      <Skeleton variant="text" width="260px" />
    </StyledTeamCard>
  );
};

export const TeamCard: VFC<Props> = ({ teamInfo, onClick }) => {
  return (
    <StyledTeamCard onClick={onClick}>
      <Box display="flex" alignItems="center" mb="8px">
        <Box mr="8px">
          <TeamIcon teamName={teamInfo.name} signedUrl={teamInfo.signedUrl} />
        </Box>
        <Typography variant="h3" maximum_lines={1}>
          {teamInfo.name}
        </Typography>
      </Box>
      <StyledDescription variant="caption" maximum_lines={2}>
        {teamInfo.description}
      </StyledDescription>
    </StyledTeamCard>
  );
};

const StyledTeamCard = styled(Card)`
  width: 300px;
  height: 130px;
  box-sizing: border-box;
  position: relative;
  top: 0;
  transition: all 0.3s;
  ${(props) =>
    props.onClick &&
    `cursor: pointer;
      &:hover {
    top: -4px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    }`}
`;

const StyledDescription = styled(Typography)`
  line-height: 1.5;
  letter-spacing: 0;
`;
