import { Box } from '@mui/system';
import { FC } from 'react';
import { DashboardModals } from '../DashboardModals';
import { SideBar } from '../SideBar';
import { LoginRequiredWrapper } from '~/components/parts/authentication/LoginRequiredWrapper';

export const DashBoardLayout: FC = ({ children }) => {
  return (
    <LoginRequiredWrapper>
      <Box display="flex">
        <Box flexShrink={1}>
          <SideBar />
        </Box>
        <Box width="100%">{children}</Box>
      </Box>
      <DashboardModals />
    </LoginRequiredWrapper>
  );
};
