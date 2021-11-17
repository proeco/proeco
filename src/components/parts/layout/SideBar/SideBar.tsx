import { ComponentProps, memo, VFC, useState, MouseEvent } from 'react';

import { Box } from '@mui/system';
import { Drawer as MuiDrawer } from '@mui/material';
import { styled, Theme, CSSObject } from '@mui/material/styles';

import { Typography, SideBarListItem, Icon, Link, IconButton, Menu } from '~/components/parts/commons';
import { UserIcon } from '~/components/domains/user/UserIcon';
import { User } from '~/domains';

type Props = {
  asPath: string;
  openContent: JSX.Element;
  closeContent: JSX.Element;
  sidebarItems: {
    icon: ComponentProps<typeof Icon>['icon'];
    url: string;
    text: string;
  }[];
  currentUser: User;
  menuItems: {
    icon: JSX.Element;
    text: string;
    onClick: () => void;
  }[];
};

const drawerWidth = 280;

export const SideBar: VFC<Props> = memo(({ asPath, sidebarItems, openContent, closeContent, currentUser, menuItems }) => {
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <StyledDrawer variant="permanent" open={open}>
      <Box position="absolute" width="100%" bgcolor="whitesmoke" display="flex" alignItems="center" justifyContent={open ? 'flex-end' : 'center'}>
        {open ? (
          <IconButton icon="ChevronLeft" width={30} onClick={handleDrawerClose} />
        ) : (
          <IconButton icon="ChevronRight" width={30} onClick={handleDrawerOpen} />
        )}
      </Box>
      <StyledSideBarWrapper width="280px" p="16px" bgcolor="whitesmoke">
        {open ? openContent : closeContent}
        <Box p="12px 0 24px" display="flex" flexDirection="column" gap="8px">
          {sidebarItems.map((sidebarItem, index) => {
            if (open) {
              return (
                <Link href={sidebarItem.url} key={index}>
                  <SideBarListItem
                    icon={<Icon icon={sidebarItem.icon} width="20px" color={sidebarItem.url === asPath ? '#fff' : 'textColor.main'} />}
                    selected={sidebarItem.url === asPath}
                  >
                    <Typography variant="body1">{sidebarItem.text}</Typography>
                  </SideBarListItem>
                </Link>
              );
            }
            return (
              <Link href={sidebarItem.url} key={index}>
                <Box width="40px" display="flex" alignItems="center" flexDirection="column" justifyContent="center">
                  <Icon icon={sidebarItem.icon} width="32px" color={sidebarItem.url === asPath ? 'primary.main' : 'textColor.main'} />
                  <Typography variant="overline" color={sidebarItem.url === asPath ? 'primary.main' : 'textColor.main'}>
                    {sidebarItem.text}
                  </Typography>
                </Box>
              </Link>
            );
          })}
        </Box>
      </StyledSideBarWrapper>
      <Box p="0 0 16px 16px">
        <StyledUserIcon size={40} imagePath={currentUser.image} userId={currentUser._id} onClick={handleClick} />
        <Menu
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          anchorEl={anchorEl}
          open={menuOpen}
          menuItems={menuItems}
          onClose={handleClose}
        />
      </Box>
    </StyledDrawer>
  );
});

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
});

const StyledDrawer = styled(MuiDrawer)<{ open: boolean }>`
  width: ${drawerWidth}px;
  flex-shrink: 0;
  white-space: nowrap;
  box-sizing: border-box;

  .MuiDrawer-paper {
    background-color: whitesmoke;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  ${(props) =>
    props.open && {
      ...openedMixin(props.theme),
      '& .MuiDrawer-paper': openedMixin(props.theme),
    }}
  ${(props) =>
    !props.open && {
      ...closedMixin(props.theme),
      '& .MuiDrawer-paper': closedMixin(props.theme),
    }}

  /*
   * モバイルではサイドバーを表示しない
   * TODO: Mixin を実装する
   */
  @media (max-width: 425px) {
    display: none;
  }
`;

const StyledSideBarWrapper = styled(Box)`
  box-sizing: border-box;
  border-right: 1px solid ${(props) => props.theme.palette.borderColor.main};
`;

const StyledUserIcon = styled(UserIcon)`
  cursor: pointer;
`;
