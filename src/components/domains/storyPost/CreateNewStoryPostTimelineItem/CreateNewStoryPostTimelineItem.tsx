import { VFC, useState } from 'react';
import { Box } from '@mui/system';

import { useSuccessNotification } from '~/hooks/useSuccessNotification';

import { UserIcon } from '~/components/domains/user/UserIcon';
import { Editor, Paper } from '~/components/parts/commons';
import { StoryPost, User } from '~/domains';
import { useErrorNotification } from '~/hooks/useErrorNotification';
import { restClient } from '~/utils/rest-client';
import { useStoryPosts } from '~/stores/storyPost';

type Props = {
  currentUser: User;
  storyId: string;
  page: number;
};

export const CreateNewStoryPostTimelineItem: VFC<Props> = ({ currentUser, storyId, page }) => {
  const { mutate: mutateStoryPosts } = useStoryPosts({
    storyId: storyId as string,
    page: page,
    limit: 10,
  });

  const { notifySuccessMessage } = useSuccessNotification();
  const { notifyErrorMessage } = useErrorNotification();

  const [content, setContent] = useState('');

  const handleCompleteEdit = async () => {
    try {
      await restClient.apiPost<StoryPost>('/story-posts', {
        storyPost: { content, storyId },
      });

      mutateStoryPosts();

      setContent('');

      notifySuccessMessage('投稿に成功しました!');
    } catch (error) {
      notifyErrorMessage('投稿に失敗しました!');
    }
  };

  return (
    <Box display="flex" alignItems="top" justifyContent="space-between" gap={1}>
      <UserIcon size={40} attachmentId={currentUser.iconImageId} userId={currentUser._id} />
      <Box width="100%">
        <Paper>
          <Editor content={content} onChangeContent={setContent} onCompleteEdit={handleCompleteEdit} />
        </Paper>
      </Box>
    </Box>
  );
};