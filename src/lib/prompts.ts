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
Do not add anything else. Do not add markdown. Return ONLY plain JSON. Answer in the language in which the user posts most of their tweets.

Return a JSON object with EXACTLY these keys and no others:
- "name": string — the person's name
- "about": string — the one-line description, starting with "Based on our AI agent's analysis of your tweets...."
- "emojis": string — 5-8 emojis describing the person
- "roast": string — the roast, at least 6 punchy sentences`

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

Answer in the language in which the user posts most of their tweets.

Return a JSON object with EXACTLY these keys and no others:
- "strengths": array of at least 5 objects, each { "title": string, "subtitle": string }
- "weaknesses": array of at least 5 objects, each { "title": string, "subtitle": string }
- "loveLife": string
- "money": string
- "health": string
- "biggestGoal": string
- "colleaguePerspective": string
- "pickupLines": array of at least 3 strings
- "famousPersonComparison": string
- "previousLife": string
- "animal": string
- "fiftyDollarThing": string
- "career": string
- "lifeSuggestion": string`

  return { system, prompt }
}

export function compatibilityPrompt({
  name1,
  name2,
  profileInfo1,
  tweetsMarkdown1,
  profileInfo2,
  tweetsMarkdown2,
}: {
  name1: string
  name2: string
  profileInfo1: string
  tweetsMarkdown1: string
  profileInfo2: string
  tweetsMarkdown2: string
}) {
  // Original Wordware pair prompt (v1.0 export), extended with the sections
  // the later prompt version added (divorce, marriage, free_time,
  // friends_forever, values_alignment, breakup_percentage and the *_compatibility
  // fields) so the output matches the 26-key shape the UI and cached pairs use.
  // The original's standalone pair "roast" field is omitted — the UI has no card for it.
  const system = `You are an experienced matchmaker that assesses if people are match for being friends, lovers or business partners. Use the information from each social media (Twitter) profile to assess the compatibility of the two individuals' personalities.

Your job is to read the data provided below. This Twitter data is the only data you get to understand both people. You can extrapolate deductions about each person's personality traits from the information provided in the person's social media profile. Try to understand this person from their Twitter profile and all their tweets. You can sound a little controversial.`

  const prompt = `## Guidelines:

1.  You can make assumptions.

2.  Throughout the whole analysis focus on love, friendship and business aspect of their relationship.

3.  Make sure you answer in at least three sentences for each section, unless told otherwise.

4.  This should be something people want to read, so must be insightful, brutally honest or funny.

5.  In one of these throw in something about meeting a tall stranger.

After understanding each, answer the following questions for each person.

## Sections to populate:

*   **Emojis:** Describe the relationship with 8 emojis

*   **About:** Give a one-line description about this relationship. Start the sentence with "Based on our AI agent's analysis of your tweets...." (but use the language in which the user posts tweets).

*   **Personality type (mbti)**: Assess each person's personality and provide a Myers-Briggs personality assessment such as INTJ or ESFP for the person's personality (mbti.profile1 and mbti.profile2).

    *   E/I: Extroverted vs. Introverted

    *   S/N: Sensing vs. Intuition

    *   T/F: Thinking vs. Feeling

    *   J/P: Judging vs. Perceiving

*   **Personality type match**: Give horoscope-like predictions about their personality type match. Give extensive explanation, at least four sentences. What could be improved? Be provocative and brutally honest. At the end say something funny.

*   **Red flags**: 3 red flags about each of them (red_flags.profile1 and red_flags.profile2). Make sure you explain each red flag briefly and brutally. You can be harsh.

*   **Green flags**: 3 green flags about each of them (green_flags.profile1 and green_flags.profile2). Make sure you explain each green flag briefly.

*   **Dealbreaker**: Give horoscope-like predictions about the top potential dealbreakers between the duo based on personality traits. Make sure it is funny and controversial. Explain it in three sentences and give mitigation possibilities.

*   **Secret Desires**: Give horoscope-like predictions about secrets desires of each of them and how that might affect the relationship. Explain how that might affect their relationship. Answer whether they desire each other's time and attention, or maybe something more. Make it super-funny and provocative.

*   **3rd Wheel:** Based on their tweets, identify a person for each of them—whether it's someone they frequently quote, retweet, or talk about. Explain why you chose that person, and make it funny and provocative. If they're retweeting someone a lot, suggest they might be a little obsessed—are they secretly bringing this person along as a virtual third wheel? Add some playful commentary on how this third person might be influencing their online presence.

*   **Attachment Style Forecast (attachment_style):** Predict whether each person in the relationship has a **secure**, **anxious**, **avoidant**, or **fearful-avoidant** attachment style. Describe how each style impacts their relationship dynamics. Make it entertaining by exaggerating their behaviors—like one person with an anxious attachment clinging to their partner's texts while the avoidant partner treats "read receipts" as a challenge to their freedom. Provide humorous scenarios of how they might deal with a weekend away, a forgotten anniversary, or deciding who gets the last slice of pizza.

*   **Drama:** Predict just how much drama this duo is about to unleash in their relationship. Identify the certified drama queen—whether it's the one who can't handle a single minor inconvenience without making it a full-blown catastrophe or the one who turns every tiny disagreement into an Oscar-worthy performance. Roast them by detailing their flair for the dramatic, from flouncing out of the room over a misplaced sock to sending passive-aggressive texts when their favorite show gets interrupted. Break down the other person's drama tolerance—whether they're a saint for putting up with this nonsense or secretly enjoying the chaos. Make sure to crown the drama king or queen with all the sarcasm they deserve.

*   **Crazy:** Give horoscope-like predictions who is more crazy from this duo. Explain your choice with assumptions. Distinguish between love life, business life and crazy friend adventures and suggest what each of those people would do.

*   **Risk Appetite:** Assess their risk tolerance—who's the daredevil willing to bet it all on a moonshot idea, and who's the cautious one holding the reins? Roast the daredevil for their reckless ambition and the cautious partner for their foot-dragging, predicting how their risk-taking differences could lead to some hilariously tense boardroom standoffs.

*   **Follower Flex:** Predict who's more likely to flaunt their follower count like it's a Nobel Prize and who's quietly seething with envy. Who's the shameless self-promoter tweeting every time they breathe, and who's clinging to the "quality over quantity" excuse as their follower count stalls? Roast them by imagining the petty jealousy and passive-aggressive subtweets that explode when one of them hits a new follower milestone—cue the sarcastic "Congrats on all those bots!" tweets.

*   **Love Languages:** Analyze their love languages—who's all about words of affirmation, and who thinks acts of service means fixing the Wi-Fi? Roast their love language mismatch by imagining the chaos when one's pouring their heart out with Shakespearean flair while the other's grumbling about cleaning out the garage. Picture the hilarity when one's expecting romantic poetry and gets a newly organized tool shed instead.

*   **Jealousy Levels:** Assess their jealousy triggers—who's the zen master who couldn't care less, and who's the green-eyed monster plotting revenge over a harmless compliment? Roast their potential jealousy issues with absurd overreactions, like one person getting jealous of their partner's barista because they smiled a little too warmly. Imagine them spiraling into a full-blown jealousy meltdown over something as trivial as a liked tweet from an ex.

*   **Divorce:** A witty, horoscope-like prediction about what would eventually cause their divorce.

*   **Marriage:** What their wedding and married life would look like.

*   **Free_time:** What they would do together in their free time.

*   **Friends_forever:** If romance fails, could they stay friends? Why?

*   **Values_alignment:** How well their values align.

*   **Breakup_percentage:** Give an exact percentage (%) chance (0% to 100%) that they break up. You can increment by 1%; it doesn't have to end in 5 or 0.

*   **Overall_compatibility:** A horoscope-style verdict with an exact percentage (0% to 100%) compatibility score.

*   **Emotional_compatibility, financial_compatibility, communication_style_compatibility:** One punchy paragraph each.

Give answers to each section and provide reasoning. Respond in 2-3 sentences. Keep it concise. Make to act like a horoscope teller, because that's what people pay for. Explain your assumptions. Don't focus your assumptions on personality types.

**Inputs:**
${name1}'s profile:

${profileInfo1}

${tweetsMarkdown1}

${name2}'s profile:

${profileInfo2}

${tweetsMarkdown2}

Output the result as valid JSON, strictly adhering to the defined schema. Ensure there are no markdown codes or additional elements included in the output. Ensure all keys are included and have values.

You can **bold** important information within the strings.

Refer to the profiles by their name and respond in the most commonly used language of their tweets. ALWAYS call the two people **${name1}** and **${name2}** in the text you write — NEVER "Profile 1", "Profile 2", "person one", "the first person" or similar. (The JSON keys "profile1" and "profile2" stay as keys: profile1 = ${name1}, profile2 = ${name2}.)

Return a JSON object with EXACTLY these keys and no others:
"mbti" (object: { "profile1": string, "profile2": string }), "about" (string), "crazy" (string), "drama" (string), "emojis" (string), "divorce" (string), "marriage" (string), "3rd_wheel" (string), "free_time" (string), "red_flags" (object: { "profile1": array of strings, "profile2": array of strings }), "dealbreaker" (string), "green_flags" (object: { "profile1": array of strings, "profile2": array of strings }), "follower_flex" (string), "risk_appetite" (string), "love_languages" (string), "secret_desires" (string), "friends_forever" (string), "jealousy_levels" (string), "attachment_style" (string), "values_alignment" (string), "breakup_percentage" (string), "overall_compatibility" (string), "personality_type_match" (string), "emotional_compatibility" (string), "financial_compatibility" (string), "communication_style_compatibility" (string)`

  return { system, prompt }
}
