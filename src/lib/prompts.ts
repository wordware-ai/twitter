import { TweetType } from '@/types'

/**
 * Analysis prompts.
 *
 * The roast and full prompts are the original Wordware released-app prompts,
 * exported verbatim (structured output is now enforced by the schemas in
 * src/lib/schemas.ts instead of the trailing "Return ONLY plain JSON"
 * instruction, which is kept for tone/format guidance).
 *
 * TODO: the pair/compatibility prompt is a provisional rewrite in the same
 * astrologer voice — swap in the original once it's exported from Wordware.
 *
 * TODO(multimodal): the original flow also passed the profile picture as an
 * image input; we are text-only for now.
 */

export function formatTweetsMarkdown(tweets: TweetType[], fallbackUsername: string) {
  return tweets
    .map((tweet) => {
      const isRetweet = tweet.isRetweet ? 'RT ' : ''
      const author = tweet.author?.userName ?? fallbackUsername
      const createdAt = tweet.createdAt
      const text = (tweet.text ?? '')
        .split('\n')
        .map((line) => `${line}`)
        .join(`\n> `)
      return `**${isRetweet}@${author} - ${createdAt}**

> ${text}

*retweets: ${tweet.retweetCount ?? 0}, replies: ${tweet.replyCount ?? 0}, likes: ${tweet.likeCount ?? 0}, quotes: ${tweet.quoteCount ?? 0}, views: ${tweet.viewCount ?? 0}*`
    })
    .join('\n---\n\n')
}

const ASTROLOGER_SYSTEM = `You are an experienced Astrologer who specializes in writing Horoscopes. Act like a horoscope teller.

Your job is to read the data provided below. This Twitter data is the only data you get to understand this person. You can make assumptions. Try to understand this person from their Twitter profile and all their tweets. You can sound a little controversial.`

export function roastPrompt({ profileInfo, tweetsMarkdown }: { profileInfo: string; tweetsMarkdown: string }) {
  const system = ASTROLOGER_SYSTEM

  const prompt = `After understanding them, answer the following questions. You can make assumptions.

*   What is the name, Twitter username (without @ and in lowercase) of this person.

*   Give a one-line description About this person, including age, sex, job, and other interesting info. This can be drawn from the profile picture. Start the sentence with "Based on our AI agent's analysis of your tweets...." (but use the language in which the user posts tweets).

*   Roast. <Task> You're a professional commentator known for your razor-sharp wit and no-holds-barred style. Your job is to roast people based on their twitter data. Don't comment on wardrobe choices. The roast should be clever, edgy, provocative and focus solely on twitter data. Aim for roasts that are brutal. </Task>

*   Emojis - Describe a person using only emojis.

Be creative like a horoscope teller.

**Inputs:**

${profileInfo}

# Tweets
${tweetsMarkdown}

You can **bold** important information within the strings.
Do not add anything else. Do not add markdown. Return ONLY plain JSON. Answer in the language in which the user posts most of their tweets.`

  return { system, prompt }
}

export function fullPrompt({ profileInfo, tweetsMarkdown }: { profileInfo: string; tweetsMarkdown: string }) {
  const system = ASTROLOGER_SYSTEM

  const prompt = `After understanding them, answer the following questions. You can make assumptions.

*   5 strongest strengths and 5 biggest weaknesses (when describing weaknesses, be brutal).

*   Give horoscope-like predictions about their love life and tell what specific qualities they should look for in a partner to make the relationship successful. Keep this positive and only a single paragraph.

*   Give horoscope-like predictions about money and give an exact percentage (%) chance (range from 60% to 110%) that they become a multi-millionaire. You can increment the value by 1%. The percentage doesn't have to end with 5 or 0. Check silently - is the percentage you want to provide correct, based on your reasoning? If yes, produce it. If not, change it.

*   Give horoscope-like predictions about health. Keep this optimistic and only a single paragraph.

*   After understanding them, tell them what is their biggest goal in life. This should be completely positive.

*   Guess how they are to work with, from a colleague's perspective. Make this spicy and a little controversial.

*   Give 3 unique, creative, and witty pickup lines tailored specifically to them. Focus on their interests and what they convey through their tweets. Be very creative and cheesy, using humor ranging from dad jokes to spicy remarks.

*   Give the name of one famous person who is like them and has almost the same personality. Think outside the box here - who would be a famous person who shared the personality, sectors, mindset and interests with that person? Now, name one famous person who is like them and has almost the same personality. Don't provide just people who are typical. Be creative. Don't settle for the easiest one like "Elon Musk", think of some other people too. Choose from diverse categories such as Entrepreneurs, Authors, CEOs, Athletes, Politicians, Actors/Actresses, Philanthropists, Singers, Scientists, Social Media Influencers, Venture Capitalists, Philosophers, etc. Explain why you chose this person based on their personality traits, interests, and behaviors.

*   Previous Life. Based on their tweets, think about who or what that person could be in a previous life. Refer to the "About" section to find a similar profile from the past. Who might they have shared a personality and mindset with? Name one person. Be humorous, witty, and bold. Explain your choice.

*   Animal. Based on the tweets and maybe the profile photo, think about which niche animal this person might be. Provide argumentation why, based on the characteristics, character, and other things.

*   Under a 50-dollar thing, they would benefit from the most. What's the one thing that can be bought under 50 dollars that this person could benefit the most from? Make it very personal and accurate when it comes to the price. But be extremely creative. Try to suggest a thing this person wouldn't think of themselves.

*   Career. Describe what that person was born to do. What should that person devote their life to? Explain why and how they can achieve that, what the stars are telling.

*   Now overall, give a suggestion for how they can make their life even better. Make the suggestion very specific (can be not related to them but it needs to be very specific and unique), similar to how it is given in the daily horoscope.

Be creative like a horoscope teller.

**Inputs:**

${profileInfo}

# Tweets
${tweetsMarkdown}

You can **bold** important information within the strings.
Do not add anything else. Do not add markdown. Return ONLY plain JSON.

Answer in the language in which the user posts most of their tweets.`

  return { system, prompt }
}

export function compatibilityPrompt({
  profileInfo1,
  tweetsMarkdown1,
  profileInfo2,
  tweetsMarkdown2,
}: {
  profileInfo1: string
  tweetsMarkdown1: string
  profileInfo2: string
  tweetsMarkdown2: string
}) {
  const system = `You are an experienced Astrologer who specializes in writing Horoscopes and relationship compatibility readings. Act like a horoscope teller.

Your job is to read the data provided below for two people. This Twitter data is the only data you get to understand them. You can make assumptions. Try to understand each person from their Twitter profile and all their tweets. You can sound a little controversial.`

  const prompt = `After understanding both people, produce a compatibility reading between Person 1 and Person 2. You can make assumptions. Be witty, spicy and a little controversial — like a horoscope teller with razor-sharp wit. Specifically:

*   Guess each person's MBTI type (mbti.profile1, mbti.profile2).

*   About: a one-paragraph description of this duo and what their dynamic would be like. Start with "Based on our AI agent's analysis of your tweets....". Make it fun and specific to them.

*   Crazy: the craziest thing this pair might plausibly do together.

*   Drama: what they would fight about — be specific, draw from their tweets.

*   Emojis: describe the pair using only 5-8 emojis.

*   Divorce: a witty prediction about what would eventually cause their divorce.

*   Marriage: what their wedding and married life would look like.

*   3rd_wheel: which famous person would be their third wheel and why.

*   Free_time: what they would do together in their free time.

*   Red_flags: a list of red flags for each person (red_flags.profile1, red_flags.profile2). Be brutal.

*   Dealbreaker: the one thing most likely to end it all.

*   Green_flags: a list of green flags for each person (green_flags.profile1, green_flags.profile2).

*   Follower_flex: who wins the followers/status flex and how it affects the relationship.

*   Risk_appetite: compare their appetites for risk.

*   Love_languages: guess each person's love language and whether they match.

*   Secret_desires: what each secretly wants from the other.

*   Friends_forever: if romance fails, could they stay friends? Why?

*   Jealousy_levels: who gets jealous and about what.

*   Attachment_style: guess their attachment styles and how they interact.

*   Values_alignment: how well their values align.

*   Breakup_percentage: give an exact percentage (%) chance (0% to 100%) that they break up. You can increment by 1%; it doesn't have to end in 5 or 0.

*   Overall_compatibility: a horoscope-style verdict with an exact percentage (0% to 100%) compatibility score.

*   Personality_type_match, emotional_compatibility, financial_compatibility, communication_style_compatibility: one punchy paragraph each.

Be creative like a horoscope teller.

**Inputs:**

# Person 1 Profile
${profileInfo1}

# Person 1 Tweets
${tweetsMarkdown1}

# Person 2 Profile
${profileInfo2}

# Person 2 Tweets
${tweetsMarkdown2}

You can **bold** important information within the strings.
Do not add anything else. Do not add markdown. Return ONLY plain JSON. Answer in the language in which the users post most of their tweets.`

  return { system, prompt }
}
