import React, { VFC } from 'react';
import { Box } from '@mui/system';
import { Emoji, Typography } from '~/components/parts/commons';

type Props = {
  emojisInfo: { emojiId: string; count: number }[];
};

export const EmojiCountResult: VFC<Props> = ({ emojisInfo }) => {
  return (
    <Box display="flex" alignItems="center" gap="12px" bgcolor="#e5e5e5" width="fit-content" borderRadius="18px" p="0 8px">
      {emojisInfo.map((emojiInfo, i) => (
        <Box key={i} p="8px" display="flex" alignItems="center" gap="4px">
          <Emoji emojiId={emojiInfo.emojiId} size={20} />
          <Typography variant="body2" bold>
            {emojiInfo.count}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};
