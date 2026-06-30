import cron from 'node-cron';
import { Post } from '../models/post.js';
import { Account } from '../models/account.js';
import { ActivityLog } from '../models/activityLog.js';
import { User } from '../models/user.js';
import zero from '../config/zuo.js';
import { sendPostPublishedEmail } from './emailService.js';

export const publishScheduledPosts = async () => {
  const now = new Date();
  
  // Find posts scheduled for the current time or earlier
  const postsToPublish = await Post.find({
    status: 'scheduled',
    scheduledFor: { $lte: now }
  });

  for (const post of postsToPublish) {
    try {
      // Find connected social media accounts for this user that match the selected platforms
      const accounts = await Account.find({
        user: post.user,
        platform: { $in: post.platforms },
        status: 'connected',
        zeroAccountId: { $exists: true }
      });

      if (accounts.length === 0) {
        console.log(`No connected zero accounts found for post ${post.id}`);
        continue;
      }

      // Map local accounts to Zero API platform structure
      const zeroPlatforms = accounts.map((acc: any) => ({
        platform: acc.platform.toLowerCase().replace(/\s+page|\s+business/g, '') as any,
        accountId: acc.zeroAccountId!
      }));

      // Construct API payload 
      const payload: any = {
        content: post.content,
        publishNow: true,
        ...(post.mediaUrl ? {
          mediaItems: [{
            type: post.mediaType || 'image',
            url: post.mediaUrl
          }]
        } : {}),
        platforms: zeroPlatforms
      };

      console.log(`Publishing post ${post.id} to zero with media ${post.mediaUrl || 'none'}`);

      // Send the publish request to Zero API
      const response = await zero.posts.createPost({
        body: payload
      });

      const publishedPost = (response.data as any)?.post || response.data;

      if (!publishedPost) {
        throw new Error('Failed to get post object from zero response');
      }

      console.log(`Post created ${publishedPost.id || publishedPost._id}`);

      // Update database status to published
      post.status = 'published';
      await post.save();

      // Create an activity log so it appears on the front-end dashboard
      await ActivityLog.create({
        user: post.user,
        actionType: 'post_published',
        description: 'Published post to accounts',
        relatedPost: post.id
      });

      // Fetch user to send publication email
      const userDoc = await User.findById(post.user);
      if (userDoc) {
        sendPostPublishedEmail(userDoc.email, userDoc.name, {
          content: post.content,
          platforms: post.platforms,
          mediaUrl: post.mediaUrl || undefined
        }).catch(err => console.error('Failed to send post published email', err));
      }

    } catch (error: any) {
      console.error(`Failed to publish post ${post.id}`, error);
      
      // Mark as failed if the API rejects it
      post.status = 'failed';
      await post.save();
    }
  }

  if (postsToPublish.length > 0) {
    console.log(`Evaluated ${postsToPublish.length} post at current time`);
  }
};

export const initScheduler = () => {
  // Run the background job every minute using 5 stars
  cron.schedule('* * * * *', async () => {
    try {
      await publishScheduledPosts();
    } catch (error: any) {
      console.error('Error in scheduler', error);
    }
  });
  
  console.log('Scheduler service initialized');
};