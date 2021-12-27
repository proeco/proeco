import { useRouter } from 'next/router';
import { VFC, useState, ChangeEvent, useEffect } from 'react';

import { Box, styled } from '@mui/system';
import { Grid } from '@mui/material';

import { TeamCard } from '../TeamCard';
import { SkeltonTeamIcon } from '../TeamIcon';
import { Ogp } from '~/interfaces/ogp';
import { Team, User } from '~/domains';

import { URLS } from '~/constants';
import { useTeamsRelatedUser } from '~/stores/team';
import { isValidUrl } from '~/utils/isValidUrl';
import { restClient } from '~/utils/rest-client';

import { useSuccessNotification } from '~/hooks/useSuccessNotification';
import { useErrorNotification } from '~/hooks/useErrorNotification';

import { TextField, Button, Icon, Paper, IconUpload } from '~/components/parts/commons';
import { useAttachment } from '~/stores/attachment';
import { useUploadAttachment } from '~/hooks/attachments';

type Props = {
  currentUser: User;
  team?: Team;
};

export const TeamForm: VFC<Props> = ({ currentUser, team }) => {
  const router = useRouter();
  const { notifySuccessMessage } = useSuccessNotification();
  const { notifyErrorMessage } = useErrorNotification();
  const { mutate: mutateTeamsRelatedUser } = useTeamsRelatedUser({ userId: currentUser._id });
  const { data: attachment } = useAttachment(team?.iconImageId);
  const { uploadAttachment, isLoading: isLoadingUploadAttachment } = useUploadAttachment();

  const [isCreating, setIsCreating] = useState(false);
  const [iconImage, setIconImage] = useState<File>();
  const [isValidForm, setIsValidForm] = useState(true);
  const [newTeam, setNewTeam] = useState<Pick<Team, 'name' | 'productId' | 'url' | 'description' | 'iconImageId'>>({
    productId: team?.productId || '',
    url: team?.url || '',
    name: team?.name || '',
    description: team?.description || '',
    iconImageId: team?.iconImageId || '',
  });

  const handleClickFetchByUrl = async () => {
    try {
      const {
        data: { ogp },
      } = await restClient.apiGet<{ ogp: Ogp }>(`/ogps?url=${newTeam.url}`);
      updateStoryForm({ description: ogp.description || '', name: ogp.siteName || '' });
    } catch (error) {
      notifyErrorMessage('データの取得に失敗しました');
    }
  };

  const handleClickCreateNewTeam = async () => {
    setIsCreating(true);
    try {
      if (team) {
        await restClient.apiPut<Team>(`/teams/${team._id}`, { team: newTeam });
        notifySuccessMessage('チームを更新しました');
      } else {
        await restClient.apiPost<Team>('/teams', { team: newTeam });
        notifySuccessMessage('チームを作成しました');
      }
      await mutateTeamsRelatedUser();
      if (!team) {
        router.push(URLS.DASHBOARD_TEAMS);
      }
      setIsCreating(false);
    } catch (error) {
      notifyErrorMessage(`チームの${team ? '更新' : '作成'}に失敗しました`);
    }
  };

  const updateStoryForm = (newObject: Partial<Team>) => {
    setNewTeam((prevState) => {
      return {
        ...prevState,
        ...newObject,
      };
    });
  };

  const handleChangeFile = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    try {
      const attachment = await uploadAttachment(e.target.files[0], `${currentUser._id}/team-icons`);
      updateStoryForm({ iconImageId: attachment._id });
      setIconImage(e.target.files[0]);
    } catch (error) {
      notifyErrorMessage('ファイルのアップロードに失敗しました');
    }
  };

  useEffect(() => {
    setIsValidForm(
      isValidUrl(newTeam.url) &&
        newTeam.name.trim() !== '' &&
        newTeam.productId.trim() !== '' &&
        newTeam.productId.trim() !== '' &&
        newTeam.iconImageId.trim() !== '' &&
        newTeam.description.trim() !== '',
    );
  }, [newTeam]);

  return (
    <Grid container>
      <Grid item xs={12} md={6} px={2} pb={3}>
        <Paper square>
          <Box display="flex" justifyContent="center">
            {isLoadingUploadAttachment ? (
              <SkeltonTeamIcon size={100} />
            ) : (
              <IconUpload
                onSelectImage={handleChangeFile}
                currentImagePath={iconImage ? URL.createObjectURL(iconImage) : attachment?.filePath}
              />
            )}
          </Box>
          <span className="mb-1 d-inline-block text-light">プロダクトの url</span>
          <Box display="flex" alignItems="center" gap={1}>
            <StyledUrlTextField fullWidth value={newTeam.url} onChange={(e) => updateStoryForm({ url: e.target.value })} />
            <StyledButton color="primary" disabled={!isValidUrl(newTeam.url)} onClick={handleClickFetchByUrl}>
              データ取得
            </StyledButton>
          </Box>
          <span className="mt-3 mb-1 d-inline-block text-light">Product Id</span>
          <TextField fullWidth value={newTeam.productId} onChange={(e) => updateStoryForm({ productId: e.target.value })} />
          <span className="mt-3 mb-1 d-inline-block text-light">名前</span>
          <TextField fullWidth value={newTeam.name} onChange={(e) => updateStoryForm({ name: e.target.value })} />
          <span className="mt-3 mb-1 d-inline-block text-light">どんなプロダクト？</span>
          <TextField
            fullWidth
            multiline
            value={newTeam.description}
            rows={6}
            onChange={(e) => updateStoryForm({ description: e.target.value })}
          />
          <Box mt={4} textAlign="center">
            <Button disabled={isCreating || !isValidForm || isLoadingUploadAttachment} color="primary" onClick={handleClickCreateNewTeam}>
              <Icon icon="PENCIL" size={20} color="WHITE" />
              {team ? '更新する' : '新規チームを作成する'}
            </Button>
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6} px={2} pb={3}>
        <h3 className="mb-3 text-center">プレビュー</h3>
        <TeamCard
          name={newTeam.name}
          productId={newTeam.productId}
          url={newTeam.url}
          description={newTeam.description}
          attachmentId={newTeam.iconImageId}
        />
      </Grid>
    </Grid>
  );
};

const StyledUrlTextField = styled(TextField)`
  flex: 1;
`;

const StyledButton = styled(Button)`
  white-space: nowrap;
`;
