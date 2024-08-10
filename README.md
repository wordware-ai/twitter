# Twitter Personality 🐦🧠

![Twitter Personality](https://twitter.wordware.ai/social/og.png)

Twitter Personality is a web application that analyzes your Twitter handle to create a personalized personality profile using Wordware AI Agent. This project leverages cutting-edge AI technologies to provide users with unique insights into their Twitter persona. 🚀

You can explore the AI agent and prompts used in this app by visiting [this Wordware link](https://app.wordware.ai/share/2436ad08-5374-4750-a0f9-105080ff97ea/playground).

## Setting Up the Project 🛠️

To set up the Twitter Personality project on your local machine, follow these steps:

1. **Clone the Repository** 📂: Clone the Twitter Personality repository from GitHub to your local machine using your preferred method (e.g., Git Bash, GitHub Desktop, or the command line).
2. **Install Dependencies** 📦: Navigate to the project directory and run `npm install` to install all the required dependencies.
3. **Environment Variables** 🔐: Create a `.env.local` file in the project root directory based on the `.env.example` file. Here are some key environment variables you'll need to set:
   - `DATABASE_URL`: Your Neon database URL (Do not expose these credentials to the browser).
   - `WORDWARE_API_KEY`: Your Wordware API key for AI processing.
   - `WORDWARE_PROMPT_ID`, `WORDWARE_ROAST_PROMPT_ID`, `WORDWARE_FULL_PROMPT_ID`, `WORDWARE_PAIR_PROMPT_ID`: The specific Wordware prompt IDs for this project.
   - `NEXT_PUBLIC_BASE_URL`: The base URL for your application (e.g., http://localhost:3000 for local development).
   - `LOOPS_API_KEY`: Your Loops API key for newsletter functionality.
   - `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`, `POSTHOG_PROJECT_ID`, `POSTHOG_PERSONAL_API_KEY`: PostHog analytics configuration.
   - `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID`, `STRIPE_PRODUCT_ID`: Stripe configuration for payments.
   - `NEXT_PUBLIC_PAIR_PASSWORD`: Password for pair functionality.
   - For scraping, you'll need at least one of the following (we use all of these in a system of fallback functions)
     - `TWITTER_API_TOKEN` and `TWITTER_COOKIE`: Twitter API configuration.
     - `APIFY_API_KEY`: API key for Apify web scraping service.
     - `SOCIALDATA_API_KEY`: SocialData API key.

Refer to the `.env.example` file for a complete list of required environment variables.

Example `.env.local` file content (replace with your actual values):
