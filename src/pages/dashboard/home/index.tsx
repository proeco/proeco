import styled from 'styled-components';

import { Button, Icon, Link } from '~/components/parts/commons';
import { DashboardLayout } from '~/components/parts/layout/DashboardLayout';

import { URLS } from '~/constants';

import { useTeamsRelatedUser } from '~/stores/team';
import { useCurrentUser } from '~/stores/user/useCurrentUser';

import { ProecoNextPage } from '~/interfaces/proecoNextPage';
import { TeamCard } from '~/components/domains/team/TeamCard';
import { SkeltonTeamCard } from '~/components/domains/team/TeamCard/TeamCard';
import { useStoriesWatchedByUser } from '~/stores/story';
import { StoryCard } from '~/components/domains/story/StoryCard';

const DashboardHomePage: ProecoNextPage = () => {
  const { data: currentUser } = useCurrentUser();
  const { data: teams } = useTeamsRelatedUser({
    userId: currentUser?._id,
  });
  const { data: storiesWatchedByUser } = useStoriesWatchedByUser({ userId: currentUser?._id });

  return (
    <DashboardLayout>
      <StyledDiv className="mx-auto">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h2 className="fw-bold mb-0 d-flex align-items-center gap-2">
            <Icon icon="PEOPLE" size={28} />
            プロダクトリスト
          </h2>
          <Link href={URLS.DASHBOARD_TEAMS_NEW}>
            <Button color="primary">
              <Icon icon="PENCIL" size={16} color="WHITE" />
              作成する
            </Button>
          </Link>
        </div>
        <div className="row gy-3 mb-5">
          {teams ? (
            teams.map((team) => (
              <div key={`my-teams-${team._id}`} className="col-12 col-sm-6 col-md-4">
                <Link href={URLS.TEAMS(team.productId)}>
                  <TeamCard name={team.name} description={team.description} attachmentId={team.iconImageId} url={team.url} />
                </Link>
              </div>
            ))
          ) : (
            <>
              <div className="col-12 col-sm-6 col-md-4">
                <SkeltonTeamCard />
              </div>
              <div className="col-12 col-sm-6 col-md-4">
                <SkeltonTeamCard />
              </div>
            </>
          )}
        </div>
        {storiesWatchedByUser?.length !== 0 && <h2 className="fw-bold mb-3">フォローしているストーリー一覧</h2>}
        <div className="row gy-3">
          {storiesWatchedByUser ? (
            storiesWatchedByUser.map((story) => (
              <div key={`my-teams-${story._id}`} className="col-12 col-sm-6 col-md-4">
                <StoryCard story={story} />
              </div>
            ))
          ) : (
            <>
              <div className="col-12 col-sm-6 col-md-4">
                <SkeltonTeamCard />
              </div>
              <div className="col-12 col-sm-6 col-md-4">
                <SkeltonTeamCard />
              </div>
            </>
          )}
        </div>
      </StyledDiv>
    </DashboardLayout>
  );
};

const StyledDiv = styled.div`
  max-width: 1200px;
`;

DashboardHomePage.getAccessControl = () => {
  return { destination: URLS.TOP, loginRequired: true };
};
export default DashboardHomePage;
