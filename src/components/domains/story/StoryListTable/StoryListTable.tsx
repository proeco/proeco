import { VFC } from 'react';

import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { styled } from '@mui/system';

import { Typography } from '~/components/parts/commons';
import { StoryTableRow } from '~/components/domains/story/StoryTableRow';

import { useStories } from '~/stores/story/useStories';

import { COLORS } from '~/constants';

type Props = {
  page: number;
  limit: 10;
  teamId: string;
};

export const StoryListTable: VFC<Props> = ({ page, limit, teamId }) => {
  const { data: stories } = useStories({
    teamId,
    page,
    limit,
  });

  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledHeaderTableCell>
                <Typography color={COLORS.TEXT_LIGHT} variant="caption">
                  ストーリー名
                </Typography>
              </StyledHeaderTableCell>
              <StyledHeaderTableCell align="right">
                <Typography color={COLORS.TEXT_LIGHT} variant="caption">
                  ステータス
                </Typography>
              </StyledHeaderTableCell>
              <StyledHeaderTableCell align="right">
                <Typography color={COLORS.TEXT_LIGHT} variant="caption">
                  応援者
                </Typography>
              </StyledHeaderTableCell>
              <StyledHeaderTableCell align="right">
                <Typography color={COLORS.TEXT_LIGHT} variant="caption">
                  最終更新日
                </Typography>
              </StyledHeaderTableCell>
            </TableRow>
          </TableHead>
          <TableBody>{stories && stories.docs.map((doc) => <StoryTableRow story={doc} key={doc._id} />)}</TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

const StyledHeaderTableCell = styled(TableCell)`
  &.MuiTableCell-root {
    padding: 6px 16px;
  }
`;