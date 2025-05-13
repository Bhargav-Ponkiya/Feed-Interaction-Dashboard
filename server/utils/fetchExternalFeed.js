const axios = require("axios");

// Fetch Twitter Posts
const fetchTwitterPosts = async () => {
  const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;

  if (!BEARER_TOKEN) {
    console.warn(
      "No Twitter bearer token found. Returning mock Twitter posts."
    );
    return [
      {
        id: "mock-tweet1",
        text: "Mock Twitter post 1",
        url: "https://twitter.com/mock1",
      },
      {
        id: "mock-tweet2",
        text: "Mock Twitter post 2",
        url: "https://twitter.com/mock2",
      },
    ];
  }

  try {
    // TwitterDev user tweets - requires user ID (you must replace with correct one)
    const userResponse = await axios.get(
      "https://api.twitter.com/2/users/by/username/TwitterDev",
      {
        headers: { Authorization: `Bearer ${BEARER_TOKEN}` },
      }
    );

    const userId = userResponse.data.data.id;

    const tweetsResponse = await axios.get(
      `https://api.twitter.com/2/users/${userId}/tweets`,
      {
        headers: { Authorization: `Bearer ${BEARER_TOKEN}` },
        params: {
          max_results: 5,
          "tweet.fields": "created_at",
        },
      }
    );

    return tweetsResponse.data.data.map((tweet) => ({
      id: tweet.id,
      text: tweet.text,
      url: `https://twitter.com/twitterdev/status/${tweet.id}`,
    }));
  } catch (error) {
    console.error("Error fetching Twitter posts:", error.message);
    return [
      {
        id: "fallback-tweet1",
        text: "Twitter fetch failed, using fallback",
        url: "#",
      },
    ];
  }
};

// Fetch Reddit Posts (Real)
const fetchRedditPosts = async () => {
  try {
    const response = await axios.get(
      "https://www.reddit.com/r/javascript/hot.json",
      {
        params: { limit: 5 },
      }
    );

    return response.data.data.children.map((post) => ({
      id: post.data.id,
      title: post.data.title,
      url: `https://www.reddit.com${post.data.permalink}`,
    }));
  } catch (error) {
    console.error("Error fetching Reddit posts:", error.message);
    return [
      {
        id: "fallback-reddit1",
        title: "Reddit fetch failed, using fallback",
        url: "#",
      },
    ];
  }
};

// Fetch LinkedIn Posts (Mock Only)
const fetchLinkedInPosts = async () => {
  const LINKEDIN_TOKEN = process.env.LINKEDIN_API_TOKEN;

  if (!LINKEDIN_TOKEN) {
    console.warn("No LinkedIn API token found. Returning mock LinkedIn posts.");
    return [
      {
        id: "mock-linkedin1",
        commentary: "Mock LinkedIn post 1: Industry trends update",
        url: "https://www.linkedin.com/feed/update/mock1",
      },
      {
        id: "mock-linkedin2",
        commentary: "Mock LinkedIn post 2: Career advice & tips",
        url: "https://www.linkedin.com/feed/update/mock2",
      },
    ];
  }

  try {
    const response = await axios.get("https://api.linkedin.com/v2/ugcPosts", {
      headers: {
        Authorization: `Bearer ${LINKEDIN_TOKEN}`,
      },
      params: {
        count: 5,
      },
    });

    return response.data.elements.map((post) => ({
      id: post.id,
      commentary: post.specificContent?.text || "LinkedIn post",
      url: post.url || "#",
    }));
  } catch (error) {
    console.error("Error fetching LinkedIn posts:", error.message);
    return [
      {
        id: "fallback-linkedin1",
        commentary: "LinkedIn fetch failed, using fallback",
        url: "#",
      },
    ];
  }
};

module.exports = {
  fetchTwitterPosts,
  fetchRedditPosts,
  fetchLinkedInPosts,
};
