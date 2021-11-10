import { ComponentProps, memo, VFC, useMemo } from 'react';
import { useRouter } from 'next/router';

import { Box, styled } from '@mui/system';

import { Skeleton } from '@mui/material';
import { Typography, SideBarListItem, Icon, Link } from '~/components/parts/commons';
import { TeamIcon } from '~/components/domains/team/TeamIcon';
import { UserIconGroup } from '~/components/domains/user/UserIconGroup';

import { Team, User } from '~/domains';

import { URLS } from '~/constants/urls';
import { useTeam, useTeamUsers } from '~/stores/team';

type Props = {
  currentTeam?: Team;
  asPath: string;
  isValidating: boolean;
  teamUsers: User[];
  teamId?: string;
};

export const Component: VFC<Props> = memo(({ asPath, teamUsers, currentTeam, isValidating, teamId }) => {
  const sidebarItems: {
    icon: ComponentProps<typeof Icon>['icon'];
    url: () => string;
    text: string;
  }[] = useMemo(
    () => [
      {
        icon: 'DashboardOutlined',
        url: () => URLS.TEAMS_DASHBOARD(teamId as string),
        text: 'ダッシュボード',
      },
      {
        icon: 'HistoryEdu',
        url: () => URLS.TEAMS_DASHBOARD_STORIES(teamId as string),
        text: 'ストーリー',
      },
      {
        icon: 'Settings',
        url: () => URLS.TEAMS_DASHBOARD_SETTING(teamId as string),
        text: '設定',
      },
    ],
    [teamId],
  );

  const TeamContent = useMemo(() => {
    if (isValidating) {
      return (
        <>
          <Skeleton variant="circular" width={80} height={80} />
          <Skeleton variant="text" width="100px" />
        </>
      );
    }

    if (currentTeam) {
      return (
        <>
          <TeamIcon team={currentTeam} size={80} />
          <Typography variant="h3" maximum_lines={1}>
            {currentTeam.name}
          </Typography>
        </>
      );
    }

    return (
      <>
        <Icon width={40} icon="Group" />
        <Typography variant="h3">undefined</Typography>
      </>
    );
  }, [isValidating, currentTeam]);

  return (
    <StyledSideBarWrapper width="280px" minHeight="100vh" p="16px" bgcolor="whitesmoke">
      <Box display="flex" flexDirection="column" alignItems="center" pt="4px">
        {TeamContent}
      </Box>
      <Box py="8px" borderBottom="1px solid #eaecf1">
        <UserIconGroup users={teamUsers} isLink />
      </Box>
      <Box p="12px 0 24px" display="flex" flexDirection="column" gap="8px">
        {sidebarItems.map((sidebarItem, index) => {
          return (
            <Link href={sidebarItem.url()} key={index}>
              <SideBarListItem
                icon={<Icon icon={sidebarItem.icon} width="20px" color={sidebarItem.url() === asPath ? '#fff' : 'textColor.main'} />}
                selected={sidebarItem.url() === asPath}
              >
                <Typography variant="body1">{sidebarItem.text}</Typography>
              </SideBarListItem>
            </Link>
          );
        })}
      </Box>
    </StyledSideBarWrapper>
  );
});

const StyledSideBarWrapper = styled(Box)`
  box-sizing: border-box;
  border-right: 1px solid ${(props) => props.theme.palette.borderColor.main};
`;

export const TeamSideBar: VFC = memo(() => {
  const router = useRouter();

  const { data: currentTeam, isValidating: isValidatingTeam } = useTeam({
    teamId: router.query.teamId as string,
  });

  const { data: teamUser = [] } = useTeamUsers({
    teamId: currentTeam?._id,
  });

  return (
    <Component asPath={router.asPath} currentTeam={currentTeam} isValidating={isValidatingTeam} teamUsers={teamUser} teamId={router.query.teamId as string} />
  );
});
