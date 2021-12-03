import React, { VFC, useState, useCallback } from 'react';
import { Box, styled } from '@mui/system';
import { ListItemIcon, MenuItem } from '@mui/material';

import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';

import { Emoji } from 'emoji-mart';
import {
  Icon,
  IconButton,
  Link,
  Dropdown,
  Editor,
  EmojiRadioGroup,
  Paper,
  MarkdownToHtmlBody,
  Typography,
  Divider,
} from '~/components/parts/commons';
import { DeleteStoryPostModal } from '~/components/domains/storyPost/DeleteStoryPostModal';
import { Reaction, StoryPost, User } from '~/domains';
import 'github-markdown-css';
import { useSuccessNotification } from '~/hooks/useSuccessNotification';
import { useErrorNotification } from '~/hooks/useErrorNotification';
import { restClient } from '~/utils/rest-client';
import { useStoryPosts } from '~/stores/storyPost';
import { COLORS } from '~/constants';

type Props = {
  currentUser: User;
  storyPost: StoryPost & { currentUserReaction?: Reaction };
  emojiIds?: string[];
  storyId: string;
  page: number;
};

export const DisplayStoryPostPaper: VFC<Props> = ({
  currentUser,
  storyPost,
  emojiIds = ['thumbsup', 'heart', 'laughing', 'partying_face'],
  storyId,
  page,
}) => {
  const [currentStoryPost, setCurrentStoryPost] = useState(storyPost);
  const [content, setContent] = useState(currentStoryPost.content);
  const [isUpdate, setIsUpdate] = useState(false);
  const [SelectedEmojiId, setSelectedEmojiId] = useState<string>(currentStoryPost.currentUserReaction?.emojiId || '');
  const [isOpenDeleteStoryPostModal, setIsOpenDeleteStoryPostModal] = useState(false);

  const { mutate: mutateStoryPosts } = useStoryPosts({
    storyId,
    page,
    limit: 10,
  });

  const displayDate = formatDistanceToNow(new Date(currentStoryPost.createdAt), { addSuffix: true, locale: ja });

  const handleClickCancelButton = () => {
    setContent(currentStoryPost.content);
    setIsUpdate(false);
  };

  const { notifySuccessMessage } = useSuccessNotification();
  const { notifyErrorMessage } = useErrorNotification();

  const handleCompleteEdit = async () => {
    try {
      await restClient.apiPut<StoryPost>(`/story-posts/${currentStoryPost._id}`, {
        storyPost: { content },
      });

      mutateStoryPosts();

      notifySuccessMessage('更新に成功しました!');
    } catch (error) {
      notifyErrorMessage('更新に失敗しました!');
    }
    setIsUpdate(false);
  };

  const handleClickUpdate = () => {
    setIsUpdate(true);
  };

  const handleClickEmoji = useCallback(
    async (emojiId: string) => {
      try {
        if (!currentStoryPost.currentUserReaction) {
          const result = await restClient.apiPost<Reaction>('/reactions', {
            reaction: {
              targetId: currentStoryPost._id,
              emojiId,
            },
          });

          setCurrentStoryPost({ ...currentStoryPost, currentUserReaction: result.data });

          setSelectedEmojiId(emojiId);
          return;
        }

        if (SelectedEmojiId === emojiId) return;

        const result = await restClient.apiPut<Reaction>('/reactions', {
          reaction: {
            ...currentStoryPost.currentUserReaction,
            emojiId,
          },
        });
        setCurrentStoryPost({ ...currentStoryPost, currentUserReaction: result.data });
        setSelectedEmojiId(emojiId);
      } catch (error) {
        notifyErrorMessage('更新に失敗しました!');
      }
    },
    [notifyErrorMessage, currentStoryPost, SelectedEmojiId],
  );

  return (
    <>
      <Paper padding={0}>
        <Box p="12px">
          <StyledBox width="100%" display="flex" alignItems="center">
            <Link href={'/user/' + currentUser._id}>{currentUser.name}</Link>
            <StyledTime dateTime={new Date(currentStoryPost.createdAt).toLocaleDateString()}>{displayDate}</StyledTime>
            <WrapDropdown>
              <Dropdown
                toggle={<IconButton icon="MoreVert" width={20} />}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem onClick={handleClickUpdate}>
                  <ListItemIcon>
                    <Icon icon="Update" width="20px" color="textColor.main" />
                  </ListItemIcon>
                  更新する
                </MenuItem>
                <MenuItem onClick={() => setIsOpenDeleteStoryPostModal(true)}>
                  <ListItemIcon>
                    <Icon icon="Delete" width="20px" color="textColor.main" />
                  </ListItemIcon>
                  削除する
                </MenuItem>
              </Dropdown>
            </WrapDropdown>
          </StyledBox>
          {isUpdate && (
            <Editor
              isUpdateMode
              content={content}
              onChangeContent={setContent}
              onCompleteEdit={handleCompleteEdit}
              onClickCancelButton={handleClickCancelButton}
            />
          )}
        </Box>
        {!isUpdate && (
          <>
            <Box p="12px">
              <MarkdownToHtmlBody content={content} />
            </Box>
            <Divider margin={0} />
            <Box p="12px">
              <Typography variant="caption" color={COLORS.TEXT_LIGHT}>
                <Emoji emoji="bulb" size={12} />
                リアクションを送信しましょう
              </Typography>
              <EmojiRadioGroup emojiIds={emojiIds} selectedEmojiId={SelectedEmojiId} onClick={handleClickEmoji} />
            </Box>
          </>
        )}
      </Paper>
      <DeleteStoryPostModal
        isOpen={isOpenDeleteStoryPostModal}
        onCloseModal={() => setIsOpenDeleteStoryPostModal(false)}
        storyId={storyId}
        page={page}
        storyPostId={currentStoryPost._id}
      />
    </>
  );
};

const StyledBox = styled(Box)`
  .MuiLink-root {
    color: ${(props) => props.theme.palette.textColor.main};
    margin-right: 8px;
  }
`;

const WrapDropdown = styled(Box)`
  margin-left: auto;
`;

const StyledTime = styled('time')`
  font-size: 12px;
  color: ${(props) => props.theme.palette.textColor.light};
`;