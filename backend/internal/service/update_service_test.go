package service

import (
	"context"
	"errors"
	"testing"
	"time"

	"github.com/stretchr/testify/require"
)

type updateCacheStub struct {
	data string
}

func (c *updateCacheStub) GetUpdateInfo(context.Context) (string, error) {
	return c.data, nil
}

func (c *updateCacheStub) SetUpdateInfo(_ context.Context, data string, _ time.Duration) error {
	c.data = data
	return nil
}

type githubReleaseClientStub struct {
	repo       string
	fetchError error
}

func (c *githubReleaseClientStub) FetchLatestRelease(_ context.Context, repo string) (*GitHubRelease, error) {
	c.repo = repo
	if c.fetchError != nil {
		return nil, c.fetchError
	}
	return &GitHubRelease{
		TagName:     "v0.1.128",
		Name:        "v0.1.128",
		PublishedAt: "2026-05-19T00:00:00Z",
		HTMLURL:     "https://github.com/TokenFree2025/sub2api-hg/releases/tag/v0.1.128",
	}, nil
}

func (c *githubReleaseClientStub) DownloadFile(context.Context, string, string, int64) error {
	return nil
}

func (c *githubReleaseClientStub) FetchChecksumFile(context.Context, string) ([]byte, error) {
	return nil, nil
}

func TestUpdateServiceUsesConfiguredRepo(t *testing.T) {
	client := &githubReleaseClientStub{}
	svc := NewUpdateService(&updateCacheStub{}, client, "0.1.127", "release", "TokenFree2025/sub2api-hg")

	info, err := svc.CheckUpdate(context.Background(), true)

	require.NoError(t, err)
	require.Equal(t, "TokenFree2025/sub2api-hg", client.repo)
	require.True(t, info.HasUpdate)
	require.Equal(t, "0.1.128", info.LatestVersion)
}

func TestUpdateServiceIgnoresCachedReleaseFromDifferentRepo(t *testing.T) {
	cache := &updateCacheStub{
		data: `{"repo":"Wei-Shaw/sub2api","latest":"0.1.999","release_info":{"html_url":"https://github.com/Wei-Shaw/sub2api/releases/tag/v0.1.999"},"timestamp":4102444800}`,
	}
	client := &githubReleaseClientStub{fetchError: errors.New("GitHub API returned 404")}
	svc := NewUpdateService(cache, client, "0.1.127", "release", "TokenFree2025/sub2api-hg")

	info, err := svc.CheckUpdate(context.Background(), false)

	require.NoError(t, err)
	require.Equal(t, "TokenFree2025/sub2api-hg", client.repo)
	require.False(t, info.HasUpdate)
	require.Equal(t, "0.1.127", info.LatestVersion)
	require.Nil(t, info.ReleaseInfo)
	require.Equal(t, "GitHub API returned 404", info.Warning)
}
