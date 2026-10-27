# Notes About This File

Parts of this document may be out of date or reflect practices that are no longer relevant to the latest version of the Web App.

Please raise an issue if you hit any issues during deployment.

# Run on a Local Machine

If you want to run a server on a LAN for personal use, this is the easiest and cheapest option.

**Simplicity:** :heart: :heart: :heart:

**Reliability:** :broken_heart:

**Affordability:** :heart: :heart: :heart:

 1. Follow the [developer setup guide](https://github.com/FarmBot/Farmbot-Web-App#self-hosting).

# Deployment Using Heroku (best reliability)

**Simplicity:** :heart: :heart: :heart: :heart:

**Reliability:** :heart: :heart: :heart: :heart:

**Affordability:** :broken_heart:

 1. Deploy as you would normally [deploy to Heroku](https://devcenter.heroku.com/articles/getting-started-with-rails6#deploy-the-app-to-heroku) (buildpacks: a Bun buildpack and _heroku/ruby_)
 2. Enable Dyno metadata: `heroku labs:enable runtime-dyno-metadata --app <app name>` (we need this to know the version number of the web app).
 3. (If emails are enabled) Enable the [Heroku scheduler](https://elements.heroku.com/addons/scheduler) and configure it to run `rake api:log_digest` every 10 minutes. This is required for Device log digests via email.

Don't forget to [set ENV vars](https://devcenter.heroku.com/articles/config-vars) and run `heroku run rake db:setup`.

# Deploying frontend assets to Vercel

This repository is a Rails application. Vercel serves the compiled frontend
assets and public static files only; Rails must still be deployed to a
Rails-compatible host with its database, Redis, and background workers.

1. Import the repository into Vercel using the repository root. The included
   `vercel.json` installs Bun dependencies, builds the frontend bundles, and
   publishes them under `/assets/dist/`.
2. Set `ASSET_URL` on the Rails backend to
   `https://agribot360-8aiq.vercel.app/assets/dist`. The Rails app will use
   this URL for its frontend bundles and allow it in its content security
   policy. Confirm that the Vercel deployment serves files under
   `/assets/dist/` before enabling this setting.
3. Configure the Rails app's public API and MQTT URLs for the backend host.
   The frontend still obtains its runtime configuration and HTML shell from
   Rails.

The Vercel root page indicates that the deployment is an asset host; it is not
the FarmBot application itself. Redeploy Vercel whenever frontend assets
change.
