# Deployment Guide for MegaMart E-commerce

This guide will help you deploy the MegaMart e-commerce MVP to various hosting platforms.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git repository (if deploying from Git)

## Local Development

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start development server:**

   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

## Building for Production

1. **Build the project:**

   ```bash
   npm run build
   ```

2. **Preview the build:**
   ```bash
   npm run preview
   ```

The built files will be in the `dist` directory.

## Deployment Options

### 1. Vercel (Recommended)

**Option A: Deploy from Git**

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel will automatically detect it's a Vite project
5. Click "Deploy"

**Option B: Deploy from CLI**

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts
4. Run: `vercel --prod` for production

### 2. Netlify

**Option A: Deploy from Git**

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Connect your repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy site"

**Option B: Deploy from CLI**

1. Install Netlify CLI: `npm i -g netlify-cli`
2. Build the project: `npm run build`
3. Run: `netlify deploy --prod --dir=dist`

### 3. GitHub Pages

1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json scripts:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```
3. Run: `npm run deploy`

### 4. AWS S3 + CloudFront

1. Build the project: `npm run build`
2. Upload the `dist` folder contents to an S3 bucket
3. Configure the bucket for static website hosting
4. Set up CloudFront distribution for better performance

### 5. Firebase Hosting

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Initialize Firebase: `firebase init`
3. Select "Hosting" and choose your project
4. Set public directory to `dist`
5. Build: `npm run build`
6. Deploy: `firebase deploy`

## Environment Variables

For production deployment, you may want to set up environment variables:

```bash
# .env.production
VITE_APP_NAME=MegaMart
VITE_APP_DESCRIPTION=Premium Shoes & Clothing
```

## Custom Domain

1. **Vercel/Netlify:**

   - Go to your project settings
   - Add your custom domain
   - Update DNS records as instructed

2. **AWS S3:**
   - Configure your CloudFront distribution
   - Add your domain to the distribution
   - Update DNS records

## Performance Optimization

1. **Enable Gzip compression** (usually automatic on modern platforms)
2. **Set up CDN** (CloudFront, Cloudflare, etc.)
3. **Optimize images** (consider using WebP format)
4. **Enable caching** for static assets

## Security Considerations

1. **HTTPS:** Ensure your site uses HTTPS (automatic on most platforms)
2. **Content Security Policy:** Consider adding CSP headers
3. **Environment Variables:** Never commit sensitive data to Git

## Monitoring

1. **Analytics:** Add Google Analytics or similar
2. **Error Tracking:** Consider Sentry or similar
3. **Uptime Monitoring:** Use services like UptimeRobot

## Troubleshooting

### Build Errors

- Check Node.js version compatibility
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npm run build`

### Deployment Issues

- Verify build output in `dist` folder
- Check platform-specific build settings
- Review deployment logs for errors

### Performance Issues

- Enable compression
- Optimize images
- Check bundle size with `npm run build -- --analyze`

## Support

For deployment issues:

1. Check the platform's documentation
2. Review build logs
3. Test locally with `npm run preview`
4. Check browser console for errors

## Next Steps

After successful deployment:

1. Test all functionality
2. Set up monitoring
3. Configure analytics
4. Plan for scaling (database, backend API, etc.)
