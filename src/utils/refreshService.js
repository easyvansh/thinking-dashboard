// Feed refresh service - coordinates fetching, health monitoring, and article storage
import { fetchMultipleFeeds } from './rssService';
import { addArticles } from './articleRepository';
import { updateSourceHealth, getAllSources } from './sourceRepository';
import { setLastRefresh } from './metadataRepository';

export const REFRESH_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  COMPLETE: 'complete',
  ERROR: 'error'
};

/**
 * Refresh all feeds
 */
export const refreshAllFeeds = async (onProgress = null) => {
  try {
    // Get all sources
    const sources = await getAllSources();

    if (sources.length === 0) {
      return {
        status: REFRESH_STATUS.ERROR,
        message: 'No sources configured',
        stats: { total: 0, success: 0, failed: 0, articles: 0 }
      };
    }

    // Mark all sources as pending
    for (const source of sources) {
      await updateSourceHealth(source.id, 'pending');
    }

    if (onProgress) {
      onProgress({ status: REFRESH_STATUS.LOADING, message: 'Fetching feeds...' });
    }

    // Fetch all feeds
    const results = await fetchMultipleFeeds(sources);

    // Process results
    let totalArticles = 0;
    let successCount = 0;
    let failureCount = 0;
    const articles = [];

    for (const result of results) {
      try {
        if (result.success) {
          // Update source health
          await updateSourceHealth(result.sourceId, 'active');
          successCount++;

          // Add articles
          if (result.articles.length > 0) {
            const newArticles = await addArticles(result.articles);
            totalArticles += newArticles.length;
            articles.push(...newArticles);
          }
        } else {
          // Update source health with error
          await updateSourceHealth(result.sourceId, 'broken', result.error);
          failureCount++;
        }
      } catch (error) {
        console.error(`Error processing feed ${result.sourceName}:`, error);
        await updateSourceHealth(result.sourceId, 'broken', error.message);
        failureCount++;
      }

      if (onProgress) {
        onProgress({
          status: REFRESH_STATUS.LOADING,
          message: `Processing ${successCount + failureCount}/${results.length}...`
        });
      }
    }

    // Update last refresh time
    await setLastRefresh();

    const stats = {
      total: sources.length,
      success: successCount,
      failed: failureCount,
      articles: totalArticles
    };

    if (onProgress) {
      onProgress({
        status: REFRESH_STATUS.COMPLETE,
        message: `Refresh complete: ${totalArticles} new articles`,
        stats
      });
    }

    return {
      status: REFRESH_STATUS.COMPLETE,
      message: `Fetched ${totalArticles} articles from ${successCount} sources`,
      stats,
      articles
    };
  } catch (error) {
    console.error('Error during refresh:', error);
    return {
      status: REFRESH_STATUS.ERROR,
      message: error.message,
      stats: { total: 0, success: 0, failed: 0, articles: 0 }
    };
  }
};

/**
 * Refresh single feed
 */
export const refreshSingleFeed = async (sourceId) => {
  try {
    const source = await (async () => {
      const { getSourceById } = await import('./sourceRepository');
      return getSourceById(sourceId);
    })();

    if (!source) {
      throw new Error(`Source ${sourceId} not found`);
    }

    // Mark as pending
    await updateSourceHealth(sourceId, 'pending');

    // Fetch feed
    const { fetchFeed } = await import('./rssService');
    const result = await fetchFeed(source.feedUrl, source.id, source.name, source.shelf);

    if (result.success) {
      // Update source health
      await updateSourceHealth(sourceId, 'active');

      // Add articles
      const newArticles = await addArticles(result.articles);

      return {
        status: 'success',
        message: `Fetched ${newArticles.length} articles`,
        articles: newArticles,
        count: newArticles.length
      };
    } else {
      // Update source health with error
      await updateSourceHealth(sourceId, 'broken', result.error);

      return {
        status: 'error',
        message: result.error,
        articles: [],
        count: 0
      };
    }
  } catch (error) {
    console.error(`Error refreshing feed ${sourceId}:`, error);
    return {
      status: 'error',
      message: error.message,
      articles: [],
      count: 0
    };
  }
};
